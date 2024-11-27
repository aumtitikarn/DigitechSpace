import React, { useState, useEffect } from 'react';
import { Check, X, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PasswordRequirements = ({ password }) => {
    const { t, i18n } = useTranslation('translation');
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  useEffect(() => {
    // Update requirements
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });

    // Calculate password strength
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;

    // Set strength label and color
    let label = '';
    let color = '';
    if (score === 0) {
      color = 'bg-gray-200';
    } else if (score <= 25) {
      label = t("authen.signup.strength.weak");
      color = 'bg-red-500';
    } else if (score <= 50) {
      label = t("authen.signup.strength.fair");
      color = 'bg-orange-500';
    } else if (score <= 75) {
      label = t("authen.signup.strength.good");
      color = 'bg-yellow-500';
    } else {
      label = t("authen.signup.strength.strong");
      color = 'bg-green-500';
    }

    setStrength({ score, label, color });
  }, [password]);

  const RequirementItem = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-red-700"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        {/* Strength Meter Header */}
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700">
            {t("authen.signup.strength.title")}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {strength.label}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <RequirementItem 
            met={requirements.length} 
            text={t("authen.signup.requirements.length")} 
          />
          <RequirementItem 
            met={requirements.uppercase} 
            text={t("authen.signup.requirements.uppercase")} 
          />
          <RequirementItem 
            met={requirements.lowercase} 
            text={t("authen.signup.requirements.lowercase")} 
          />
          <RequirementItem 
            met={requirements.number} 
            text={t("authen.signup.requirements.number")} 
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;