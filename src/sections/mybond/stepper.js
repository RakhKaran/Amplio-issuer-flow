import { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';

import MainFile from './borrowing/main';
import FinancialDetails from './financial-details';
import LaunchIssue from './launch-issue';
import IsinActivation from './isin-activation';
import RegulatoryFiling from './regulatory-filing';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import FundAndCreditForm from './fund-position-and-credit-rating/fundAndCreditForm';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import PriliminaryAndCollateralView from './preliminary-requirements-and collatral-details/priliminaryAndCollateralView';
import ExecuteDocument from './execute-documents';
import IsinActivationMain from './isin-activation/isin-activation-main';
import IntermediariesView from './intermediates/intermediates-view/intermediate-view';
import MyBondNewIssue from './my-new-issue/my-bond-new-issue';

export default function MybondStepper() {
  const [activeStepId, setActiveStepId] = useState('my_bond_new_issue');
  const [formData, setFormData] = useState({
    my_bond_new_issue: {},
    fund_position: {},
    trustee_selection: {},
    execute_document: {},
    audited_financial: {},
    borrowing_details: {},
    financial_details: {},
    preliminary_bond_requirements: {},
    regulatory_filing: {},
    isin_activation: {},
    launch_issue: {},
  });

  const steps = [
    {
      id: 'my_bond_new_issue',
      number: 1,
      lines: ['New Issue', 'Setup'],
    },
    {
      id: 'fund_position',
      number: 2,
      lines: ['Fund', 'Position'],
    },
    {
      id: 'trustee_selection',
      number: 3,
      lines: ['Trustee', 'Selection'],
    },

    {
      id: 'audited_financial',
      number: 4,
      lines: ['Audited', 'Financials'],
    },
    {
      id: 'borrowing_details',
      number: 5,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'financial_details',
      number: 6,
      lines: ['Financial', 'Details'],
    },
    {
      id: 'preliminary_bond_requirements',
      number: 7,
      lines: ['Preliminary', 'Requirements'],
    },
    {
      id: 'regulatory_filing',
      number: 8,
      lines: ['Regulatory', 'Filing'],
    },
    {
      id: 'isin_activation',
      number: 9,
      lines: ['ISIN', 'Activation'],
    },
    {
      id: 'execute_document',
      number: 10,
      lines: ['Execute', 'Document'],
    },
    {
      id: 'launch_issue',
      number: 11,
      lines: ['Launch', 'Issue'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    my_bond_new_issue: { percent: 0 },
    fund_position: { percent: 0 },
    trustee_selection: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    financial_details: { percent: 0 },
    preliminary_bond_requirements: { percent: 0 },
    regulatory_filing: { percent: 0 },
    isin_activation: { percent: 0 },
    execute_document: { percent: 0 },
    launch_issue: { percent: 0 },
  });

  useEffect(() => {
    const savedStep = localStorage.getItem('activeStepId');
    const savedForm = localStorage.getItem('formData');
    const savedProgress = localStorage.getItem('stepsProgress');

    if (savedStep) setActiveStepId(savedStep);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedProgress) setStepsProgress(JSON.parse(savedProgress));
  }, []);

  useEffect(() => {
    localStorage.setItem('activeStepId', activeStepId);
  }, [activeStepId]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('stepsProgress', JSON.stringify(stepsProgress));
  }, [stepsProgress]);

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const saveStepData = (stepId, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...data, // merge new fields with old
      },
    }));
  };

  const handleStepClick = (stepId) => {
    // Prevent jumping forward if previous step is incomplete
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'my_bond_new_issue':
        return (
          <MyBondNewIssue
            currentIssueDetail={formData.my_bond_new_issue?.issueDetails || null}
            currentIssueDocument={formData.my_bond_new_issue?.documentData || null}
            percent={(p) => updateStepPercent('my_bond_new_issue', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('my_bond_new_issue', data)}
          />
        );

      case 'fund_position':
        return (
          <FundAndCreditForm
            // currentFund={formData.fund_position}
            percent={(p) => updateStepPercent('fund_position', p)}
            setActiveStepId={setActiveStepId}
            currentFundPosition={formData.fund_position?.fundData || null}
            currentCapitalDetails={formData.fund_position?.capitalDetails || null}
            // currentCreditRatings={
            //   Array.isArray(formData.fund_position?.creditRatingData)
            //     ? formData.fund_position.creditRatingData
            //     : []
            // }
            saveStepData={(section, data) => saveStepData('fund_position', { [section]: data })}
          />
        );

      case 'trustee_selection':
        return (
          <IntermediariesView
            currentIssue={formData.my_bond_new_issue}
            percent={(p) => updateStepPercent('trustee_selection', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('trustee_selection', data)}
          />
        );

      case 'audited_financial':
        return (
          <AuditedFinancialDocument
            currentAuditedDetails={formData.audited_financial}
            percent={(p) => updateStepPercent('audited_financial', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('audited_financial', data)}
          />
        );

      case 'borrowing_details':
        return (
          <MainFile
            currentDetails={formData.borrowing_details}
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('borrowing_details', data)}
          />
        );

      case 'financial_details':
        return (
          <FinancialDetails
            currentFinancial={formData.financial_details}
            percent={(p) => updateStepPercent('financial_details', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('financial_details', data)}
          />
        );

      case 'preliminary_bond_requirements':
        return (
          <PriliminaryAndCollateralView
            currentPrliminaryRequirements={
              formData.preliminary_bond_requirements?.preliminaryData || null
            }
            currentCollateral={formData.preliminary_bond_requirements?.collateralData || null}
            percent={(p) => updateStepPercent('preliminary_bond_requirements', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(section, data) =>
              saveStepData('preliminary_bond_requirements', { [section]: data })
            }
          />
        );

      case 'regulatory_filing':
        return (
          <RegulatoryFiling
            currentRegulatory={formData.regulatory_filing}
            percent={(p) => updateStepPercent('regulatory_filing', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('regulatory_filing', data)}
          />
        );
      case 'isin_activation':
        return (
          <IsinActivationMain
            currentIsin={formData.isin_activation?.isin_activation || {}}
            currentDemat={formData.isin_activation?.demat_credit_details || {}}
            currentTrusteeApproval={formData.isin_activation?.trustee_sebi_approval || {}}
            percent={(p) => updateStepPercent('isin_activation', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(section, data) => saveStepData('isin_activation', { [section]: data })}
          />
        );

      case 'execute_document':
        return (
          <ExecuteDocument
            currentExecuteDocument={formData.execute_document}
            percent={(p) => updateStepPercent('execute_document', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('execute_document', data)}
          />
        );
      case 'launch_issue':
        return (
          <LaunchIssue
            currentLaunchIssue={formData.launch_issue}
            percent={(p) => updateStepPercent('launch_issue', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('launch_issue', data)}
          />
        );

      default:
        return <Box>Done</Box>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>{renderForm()}</Stack>
    </Box>
  );
}
