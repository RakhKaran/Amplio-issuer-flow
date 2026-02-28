// new issue setup...
export function NewIssueSetup(options = {}) {
    const issueType = options.issueType ?? 'public';

    const data = {
        issueType,
        securityType: 'secured',
        issueSize: 500000000,
        tenureYears: 5,
        preferedInvestorCategory: issueType === 'private' ? 'HNI' : '',
        preferedPaymentCycle: 'monthly',
        couponRate: 12,
        minimumInvestmentPrice: '100000',
        redemptionType: 'bullet',
        minimumPurchaseUnit: '10',
        totalUnit: '50000',
    };

    return data;
};


export function NewBusinessProfile() {
    const data = {
        yearInBusiness: '5',
        turnover: '25000000',
        projectedTurnover: '75000000',
    };
    return data;
};

export function NewFundPosition() {
    const data = {
        cashAndBankBalance: '25000000',
        cashAndBankBalanceDate: new Date('2025-01-10'),
        inventoryAmount: '15000000',
        prepaidExpensesAmount: '5000000',
        otherCurrentAssetsAmount: '7000000',
        currentLiabilitiesAmount: '12000000',
        currentAssetsAndLiabilitiesDate: new Date('2025-01-10'),
    };
    return data;
};

export function NewCapitalDetails() {
    const data = {
        shareCapital: 50000000,
        reserveSurplus: 30000000,
        netWorth: 80000000,
    };
    return data;
};

// For Borrowing Details
export function NewBorrowingDetails() {
    const data = {
        secured: '20000000',
        'unsecured.fromPromoters': '5000000',
        'unsecured.fromOthers': '3000000',
    };
    return data;
}

// For Financial Ratios
export function NewFinancialRatios() {
    const data = {
        debtEquityRatio: '1.5',
        currentRatio: '1.8',
        netWorth: 80000000,
        quickRatio: '1.2',
        returnOnEquity: '15.5',
        returnOnAssets: '8.2',
        debtServiceCoverageRatio: '1.8',
    };
    return data;
}

// For Profitability Details
export function NewProfitabilityDetails() {
    const data = {
        netProfit: 5000000,
    };
    return data;
}

// For Collateral Assets (text fields only)
export function NewCollateralAsset() {
    const data = {
        collateralType: '',
        chargeType: '',
        ownershipType: '',
        description: 'Commercial property located in Mumbai',
        estimatedValue: '50000000',
        valuationDate: new Date('2025-01-15'),
        trustName: 'Sample Trust Name',
        securityDocRef: 'SEC-REF-2025-001',
        remark: 'Prime collateral for issue coverage',
    };
    return data;
}

export function NewAuditedFinancials() {
    const data = {
        baseDate: new Date('2025-03-31'),
        amounts: {
            year1: '12000000',
            year2: '18000000',
            year3: '25000000',
        },
    };
    return data;
}

export function NewGuarantorDetails(options = {}) {
    const guarantorType = options.guarantorType ?? 'Corporate';
    const isCorporate = guarantorType === 'Corporate';

    const data = {
        guarantorType,
        guarantorName: isCorporate ? 'ABC GUARANTEE PRIVATE LIMITED' : 'RAHUL SHARMA',
        email: isCorporate ? 'compliance@abcguarantee.com' : 'rahul.sharma@example.com',
        phoneNumber: '9876543210',
        cin: isCorporate ? 'U12345MH2020PTC123456' : '',
        estimetedNetWorth: '250000000',
        guarantorAmountLimit: '100000000',
        fullName: isCorporate ? 'AUTHORIZED SIGNATORY' : 'RAHUL SHARMA',
        panNumber: isCorporate ? 'ABCDE1234F' : 'FGHIJ5678K',
        adharNumber: isCorporate ? '' : '123412341234',
        consent: true,
    };

    return data;
}

export function NewAuditedFinancialStatementsDoc() {
    return {
        auditorName: 'ABC & CO CHARTERED ACCOUNTANTS',
        auditedType: 'audited',
        reportDate: new Date('2025-03-31'),
    };
}

export function NewAuditedIncomeTaxReturnDoc() {
    return {
        auditorName: 'ABC & CO CHARTERED ACCOUNTANTS',
        auditedType: 'audited',
        reportDate: new Date('2025-03-31'),
    };
}

export function NewAuditedGSTR9Doc() {
    return {
        auditorName: 'ABC & CO CHARTERED ACCOUNTANTS',
        auditedType: 'audited',
        reportDate: new Date('2025-03-31'),
    };
}

export function NewAuditedGSTR3BDoc() {
    return {
        auditorName: 'ABC & CO CHARTERED ACCOUNTANTS',
        auditedType: 'audited',
        reportDate: new Date('2025-03-31'),
    };
}







