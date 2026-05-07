'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTrade } from '@/hooks/useTrade';
import { DocumentType, getDocumentTypeLabel } from '@/lib/azaka/types';
import { showTxPending, showTxSuccess, showTxError, dismissTx } from '@/components/shared/TxToast';
import { z } from 'zod';
import clsx from 'clsx';

const tradeSchema = z.object({
  importer: z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address'),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Amount must be greater than 0'),
  asset: z.enum(['USDC', 'NGNC']),
  expiryDays: z.number().min(7, 'Minimum 7 days').max(365, 'Maximum 365 days'),
  requiredDocuments: z.array(z.nativeEnum(DocumentType)).min(1, 'Select at least one document'),
  issuingBank: z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address'),
  confirmingBank: z.string().optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

const DOCUMENT_OPTIONS = [
  { type: DocumentType.BillOfLading, description: 'Proof of shipment and receipt of goods' },
  { type: DocumentType.CertificateOfOrigin, description: 'Certifies the country of origin' },
  { type: DocumentType.InspectionCertificate, description: 'Quality and quantity verification' },
  { type: DocumentType.PhytosanitaryCertificate, description: 'Plant health certification' },
  { type: DocumentType.CustomsDeclaration, description: 'Customs clearance documentation' },
];

export const CreateTradeForm = () => {
  const router = useRouter();
  const createTrade = useCreateTrade();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TradeFormData>>({
    asset: 'USDC',
    expiryDays: 30,
    requiredDocuments: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.importer) {
        newErrors.importer = 'Importer address is required';
      } else if (!/^G[A-Z0-9]{55}$/.test(formData.importer)) {
        newErrors.importer = 'Invalid Stellar address';
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Valid amount is required';
      }

      if (!formData.expiryDays || formData.expiryDays < 7) {
        newErrors.expiryDays = 'Minimum 7 days required';
      }
    }

    if (currentStep === 2) {
      if (!formData.requiredDocuments || formData.requiredDocuments.length === 0) {
        newErrors.requiredDocuments = 'Select at least one document';
      }
    }

    if (currentStep === 3) {
      if (!formData.issuingBank) {
        newErrors.issuingBank = 'Issuing bank address is required';
      } else if (!/^G[A-Z0-9]{55}$/.test(formData.issuingBank)) {
        newErrors.issuingBank = 'Invalid Stellar address';
      }

      if (formData.confirmingBank && !/^G[A-Z0-9]{55}$/.test(formData.confirmingBank)) {
        newErrors.confirmingBank = 'Invalid Stellar address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const toggleDocument = (docType: DocumentType) => {
    const current = formData.requiredDocuments || [];
    const updated = current.includes(docType)
      ? current.filter(d => d !== docType)
      : [...current, docType];
    setFormData({ ...formData, requiredDocuments: updated });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const toastId = showTxPending('Creating trade...');
    try {
      const expiryDate = Date.now() + (formData.expiryDays! * 24 * 60 * 60 * 1000);
      
      const tradeId = await createTrade.mutateAsync({
        importer: formData.importer!,
        amount: formData.amount!,
        asset: formData.asset!,
        expiryDate,
        requiredDocuments: formData.requiredDocuments!,
        issuingBank: formData.issuingBank!,
        confirmingBank: formData.confirmingBank,
      });

      dismissTx(toastId);
      showTxSuccess(tradeId, 'Trade created successfully');
      router.push(`/trade/${tradeId}`);
    } catch (error) {
      dismissTx(toastId);
      showTxError(error as Error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                  s === step
                    ? 'bg-brand text-white'
                    : s < step
                    ? 'bg-success text-white'
                    : 'bg-surface-secondary text-text-muted'
                )}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div
                  className={clsx(
                    'flex-1 h-1 mx-2 transition-colors',
                    s < step ? 'bg-success' : 'bg-surface-secondary'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Trade Details</span>
          <span>Documents</span>
          <span>Banks</span>
        </div>
      </div>

      {/* Step 1: Trade Details */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Trade Details</h2>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Importer Address *
            </label>
            <input
              type="text"
              value={formData.importer || ''}
              onChange={e => setFormData({ ...formData, importer: e.target.value })}
              placeholder="GDZST3XVCDTUJ76ZAV2HA72KYQODXXZ5PTMAPZGDHZ6CS7RO7MGG3DBM"
              className={clsx(
                'w-full px-4 py-3 border rounded-lg font-mono text-sm',
                errors.importer ? 'border-danger' : 'border-border'
              )}
            />
            {errors.importer && (
              <p className="mt-1 text-sm text-danger">{errors.importer}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Amount *
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder="50000.00"
                step="0.01"
                className={clsx(
                  'w-full px-4 py-3 border rounded-lg',
                  errors.amount ? 'border-danger' : 'border-border'
                )}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-danger">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Asset *
              </label>
              <select
                value={formData.asset}
                onChange={e => setFormData({ ...formData, asset: e.target.value as 'USDC' | 'NGNC' })}
                className="w-full px-4 py-3 border border-border rounded-lg"
              >
                <option value="USDC">USDC</option>
                <option value="NGNC">NGNC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Expiry (days from now) *
            </label>
            <input
              type="number"
              value={formData.expiryDays || 30}
              onChange={e => setFormData({ ...formData, expiryDays: parseInt(e.target.value) })}
              min="7"
              max="365"
              className={clsx(
                'w-full px-4 py-3 border rounded-lg',
                errors.expiryDays ? 'border-danger' : 'border-border'
              )}
            />
            {errors.expiryDays && (
              <p className="mt-1 text-sm text-danger">{errors.expiryDays}</p>
            )}
            <p className="mt-1 text-sm text-text-muted">Minimum 7 days, maximum 365 days</p>
          </div>
        </div>
      )}

      {/* Step 2: Documents */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Required Documents</h2>
          <p className="text-text-secondary">Select the documents required for this trade</p>

          {errors.requiredDocuments && (
            <p className="text-sm text-danger">{errors.requiredDocuments}</p>
          )}

          <div className="space-y-3">
            {DOCUMENT_OPTIONS.map(({ type, description }) => (
              <label
                key={type}
                className={clsx(
                  'flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors',
                  formData.requiredDocuments?.includes(type)
                    ? 'border-brand bg-brand-light'
                    : 'border-border hover:border-brand/50'
                )}
              >
                <input
                  type="checkbox"
                  checked={formData.requiredDocuments?.includes(type)}
                  onChange={() => toggleDocument(type)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary mb-1">
                    {getDocumentTypeLabel(type)}
                  </div>
                  <div className="text-sm text-text-secondary">{description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Banks */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Bank Selection</h2>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Issuing Bank Address *
            </label>
            <input
              type="text"
              value={formData.issuingBank || ''}
              onChange={e => setFormData({ ...formData, issuingBank: e.target.value })}
              placeholder="GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX"
              className={clsx(
                'w-full px-4 py-3 border rounded-lg font-mono text-sm',
                errors.issuingBank ? 'border-danger' : 'border-border'
              )}
            />
            {errors.issuingBank && (
              <p className="mt-1 text-sm text-danger">{errors.issuingBank}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirming Bank Address (Optional)
            </label>
            <input
              type="text"
              value={formData.confirmingBank || ''}
              onChange={e => setFormData({ ...formData, confirmingBank: e.target.value })}
              placeholder="GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
              className={clsx(
                'w-full px-4 py-3 border rounded-lg font-mono text-sm',
                errors.confirmingBank ? 'border-danger' : 'border-border'
              )}
            />
            {errors.confirmingBank && (
              <p className="mt-1 text-sm text-danger">{errors.confirmingBank}</p>
            )}
          </div>

          {/* Summary */}
          <div className="p-6 bg-surface-secondary rounded-lg">
            <h3 className="font-semibold text-text-primary mb-4">Trade Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Amount:</span>
                <span className="text-text-primary font-medium">
                  {formData.amount} {formData.asset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Expiry:</span>
                <span className="text-text-primary">{formData.expiryDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Documents:</span>
                <span className="text-text-primary">{formData.requiredDocuments?.length || 0} required</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-border rounded-lg hover:bg-surface-secondary transition-colors font-medium"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={createTrade.isPending}
            className="flex-1 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {createTrade.isPending ? 'Creating Trade...' : 'Create Trade'}
          </button>
        )}
      </div>
    </div>
  );
};
