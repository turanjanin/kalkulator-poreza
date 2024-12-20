const exchangeRateField = document.getElementById('exchange-rate');
const bruto2ForeignField = document.getElementById('bruto2-foreign');
const contributionBaseMinField = document.getElementById('contribution-base-min');
const minimalNetoSalaryField = document.getElementById('llc-minimal-neto-salary');
const lumpSumTaxField = document.getElementById('lump-sum-tax');
const entrepreneurSalaryField = document.getElementById('entrepreneur-salary');
const entrepreneurExpensesField = document.getElementById('entrepreneur-expenses');
const llcSalaryField = document.getElementById('llc-desired-monthly-neto');
const llcDividendSalaryField = document.getElementById('llc-dividend-desired-monthly-neto');

let exchangeRate;
let bruto2Foreign;
let bruto2;

const taxes = {
    freelancer1: {
        income: 0.20,
        pension: 0.24,
        health: 0.103,
    },
    freelancer2: {
        income: 0.10,
        pension: 0.24,
        health: 0.103,
    },
    entrepreneur: {
        income: 0.10,
        pension: 0.24,
        health: 0.103,
        unemployment: 0.0075,
        profit: 0.10,
    },
    employee: {
        pensionEmployer: 0.10,
        healthEmployer: 0.0515,
        income: 0.10,
        pension: 0.14,
        health: 0.0515,
        unemployment: 0.0075,
    },
    llc: {
        profit: 0.15,
        dividend: 0.15,
    },
    yearly: {
        rate1: 0.10,
        rate2: 0.15,
    },
};

function formatAmount(value) {
    if (typeof value === 'string') {
        return value;
    }

    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat('sr-RS', options).format(value);
}

function formatPercentage(value) {
    if (typeof value === 'string') {
        return value;
    }

    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat('sr-RS', options).format(value * 100) + '%';
}

function updateSalaries() {
    bruto2 = bruto2Foreign * exchangeRate;
    document.querySelector('[data-value=bruto2-foreign-yearly]').innerText = formatAmount(bruto2Foreign * 12);
    document.querySelector('[data-value=bruto2]').innerText = formatAmount(bruto2);
    document.querySelector('[data-value=bruto2-yearly]').innerText = formatAmount(bruto2 * 12);
}

function updateFreelancer1() {
    const quarterlyEarnings = bruto2 * 3;
    const standardizedCosts = parseFloat(document.getElementById('freelancer1-standardized-costs').value);
    const minimalHealthContribution = parseFloat(document.getElementById('freelancer-minimal-health').value);

    let taxBase = quarterlyEarnings - standardizedCosts;
    if (taxBase < 0) {
        taxBase = 0;
    }

    const incomeTax = taxBase * taxes.freelancer1.income;
    const pension = taxBase * taxes.freelancer1.pension;
    let health = taxBase * taxes.freelancer1.health;
    if (health < minimalHealthContribution) {
        health = minimalHealthContribution;
    }

    const quarterlyTax = incomeTax + pension + health;
    const monthlyTax = quarterlyTax / 3;

    const neto = bruto2 - monthlyTax;
    const netoForeign = neto / exchangeRate;
    const taxPercentage = monthlyTax / bruto2;
    const netoPercentage = 1 - taxPercentage;
    const netoYearly = neto * 12;

    const yearlyTax = getYearlyTax(netoYearly);

    document.querySelector('[data-value=freelancer1-quarterly-earnings]').innerText = formatAmount(quarterlyEarnings);
    document.querySelector('[data-value=freelancer1-standardized-costs]').innerText = formatAmount(standardizedCosts);
    document.querySelector('[data-value=freelancer1-tax-base]').innerText = formatAmount(taxBase);
    document.querySelector('[data-value=freelancer1-income-tax]').innerText = formatAmount(incomeTax);
    document.querySelector('[data-value=freelancer1-pension]').innerText = formatAmount(pension);
    document.querySelector('[data-value=freelancer1-health]').innerText = formatAmount(health);
    document.querySelector('[data-value=freelancer1-quarterly-tax]').innerText = formatAmount(quarterlyTax);
    document.querySelector('[data-value=freelancer1-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=freelancer1-neto]').innerText = formatAmount(neto);
    document.querySelector('[data-value=freelancer1-neto-foreign]').innerText = formatAmount(netoForeign);
    document.querySelector('[data-value=freelancer1-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=freelancer1-neto-percentage]').innerText = formatPercentage(netoPercentage);
    document.querySelector('.freelancer1 .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=freelancer1-neto-yearly]').innerText = formatAmount(netoYearly);
    document.querySelector('[data-value=freelancer1-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=freelancer1-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);
}

function updateFreelancer2() {
    const quarterlyEarnings = bruto2 * 3;
    const standardizedCosts = parseFloat(document.getElementById('freelancer2-standardized-costs').value) + quarterlyEarnings * 0.34;
    const minimalHealthContribution = parseFloat(document.getElementById('freelancer-minimal-health').value);
    const contributionBaseMin = parseFloat(contributionBaseMinField.value);

    let taxBase = quarterlyEarnings - standardizedCosts;
    if (taxBase < 0) {
        taxBase = 0;
    }

    const incomeTax = taxBase * taxes.freelancer2.income;
    let pension = taxBase * taxes.freelancer2.pension;
    if (taxBase < contributionBaseMin * 3) {
        pension = contributionBaseMin * 3 * taxes.freelancer2.pension;
    }


    let health = taxBase * taxes.freelancer2.health;
    if (health < minimalHealthContribution) {
        health = minimalHealthContribution;
    }

    const quarterlyTax = incomeTax + pension + health;
    const monthlyTax = quarterlyTax / 3;

    const neto = bruto2 - monthlyTax;
    const netoForeign = neto / exchangeRate;
    const taxPercentage = monthlyTax / bruto2;
    const netoPercentage = 1 - taxPercentage;
    const netoYearly = neto * 12;

    const yearlyTax = getYearlyTax(netoYearly);

    document.querySelector('[data-value=freelancer2-quarterly-earnings]').innerText = formatAmount(quarterlyEarnings);
    document.querySelector('[data-value=freelancer2-standardized-costs]').innerText = formatAmount(standardizedCosts);
    document.querySelector('[data-value=freelancer2-tax-base]').innerText = formatAmount(taxBase);
    document.querySelector('[data-value=freelancer2-income-tax]').innerText = formatAmount(incomeTax);
    document.querySelector('[data-value=freelancer2-pension]').innerText = formatAmount(pension);
    document.querySelector('[data-value=freelancer2-health]').innerText = formatAmount(health);
    document.querySelector('[data-value=freelancer2-quarterly-tax]').innerText = formatAmount(quarterlyTax);
    document.querySelector('[data-value=freelancer2-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=freelancer2-neto]').innerText = formatAmount(neto);
    document.querySelector('[data-value=freelancer2-neto-foreign]').innerText = formatAmount(netoForeign);
    document.querySelector('[data-value=freelancer2-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=freelancer2-neto-percentage]').innerText = formatPercentage(netoPercentage);
    document.querySelector('.freelancer2 .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=freelancer2-neto-yearly]').innerText = formatAmount(netoYearly);
    document.querySelector('[data-value=freelancer2-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=freelancer2-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);
}

function updateLumpSum() {
    const yearlyLimit = 6000000;

    let monthlyTax = '-';
    let neto = '-';
    let netoForeign = '-';
    let taxPercentage = '';
    let netoPercentage = '';
    let netoYearly = '-';
    let yearlyTaxUnder40 = '-';
    let yearlyTaxOver40 = '-';

    const yearlyEarnings = bruto2 * 12;

    if (yearlyEarnings < yearlyLimit) {
        monthlyTax =  parseFloat(document.getElementById('lump-sum-tax').value);
        neto = bruto2 - monthlyTax;
        netoForeign = neto / exchangeRate;
        taxPercentage = monthlyTax / bruto2;
        netoPercentage = 1 - taxPercentage;
        netoYearly = neto * 12;

        const yearlyTax = getYearlyTax(netoYearly);
        yearlyTaxUnder40 = yearlyTax.totalUnder40;
        yearlyTaxOver40 = yearlyTax.totalOver40;

        document.querySelector('[data-value=lump-sum-neto-percentage]').innerText = formatPercentage(netoPercentage);
        document.querySelector('.lump-sum .bar span').style.width = `${netoPercentage * 100}%`;
    } else {
        document.querySelector('[data-value=lump-sum-neto-percentage]').innerText = 'Није применљиво за бруто 2 зараду већу од 6M динара';
        document.querySelector('.lump-sum .bar span').style.width = `0%`;
    }

    document.querySelector('[data-value=lump-sum-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=lump-sum-neto]').innerText = formatAmount(neto);
    document.querySelector('[data-value=lump-sum-neto-foreign]').innerText = formatAmount(netoForeign);
    document.querySelector('[data-value=lump-sum-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=lump-sum-neto-yearly]').innerText = formatAmount(netoYearly);
    document.querySelector('[data-value=lump-sum-yearly-tax-under-40]').innerText = formatAmount(yearlyTaxUnder40);
    document.querySelector('[data-value=lump-sum-yearly-tax-over-40]').innerText = formatAmount(yearlyTaxOver40);
}

function updateEntrepreneur() {
    let salary = parseFloat(document.getElementById('entrepreneur-salary').value);
    const minSalary = parseFloat(contributionBaseMinField.value);

    if (salary < minSalary) {
        salary = minSalary;
    }

    const expenses = parseFloat(document.getElementById('entrepreneur-expenses').value);
    const untaxableIncome = parseFloat(document.getElementById('untaxable-income').value);

    const incomeTax = (salary - untaxableIncome) * taxes.entrepreneur.income;
    const pension = salary * taxes.entrepreneur.pension;
    const health = salary * taxes.entrepreneur.health;
    const unemployment = salary * taxes.entrepreneur.unemployment;
    const netoSalary = salary - incomeTax - pension - health - unemployment;

    const profitBeforeTax = bruto2 - salary - expenses;
    const profitTax = profitBeforeTax * taxes.entrepreneur.profit;

    const monthlyTax = incomeTax + pension + health + unemployment + profitTax;

    const neto = bruto2 - monthlyTax;
    const netoForeign = neto / exchangeRate;
    const taxPercentage = monthlyTax / bruto2;
    const netoPercentage = 1 - taxPercentage;
    const netoYearly = neto * 12;

    const yearlyTax = getYearlyTax(netoYearly);

    document.querySelector('[data-value=entrepreneur-income-tax]').innerText = formatAmount(incomeTax);
    document.querySelector('[data-value=entrepreneur-pension]').innerText = formatAmount(pension);
    document.querySelector('[data-value=entrepreneur-health]').innerText = formatAmount(health);
    document.querySelector('[data-value=entrepreneur-unemployment]').innerText = formatAmount(unemployment);
    document.querySelector('[data-value=entrepreneur-salary-neto]').innerText = formatAmount(netoSalary);
    document.querySelector('[data-value=entrepreneur-profit-before-tax]').innerText = formatAmount(profitBeforeTax);
    document.querySelector('[data-value=entrepreneur-profit-tax]').innerText = formatAmount(profitTax);
    document.querySelector('[data-value=entrepreneur-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=entrepreneur-neto]').innerText = formatAmount(neto);
    document.querySelector('[data-value=entrepreneur-neto-foreign]').innerText = formatAmount(netoForeign);
    document.querySelector('[data-value=entrepreneur-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=entrepreneur-neto-percentage]').innerText = formatPercentage(netoPercentage);
    document.querySelector('.entrepreneur .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=entrepreneur-neto-yearly]').innerText = formatAmount(netoYearly);
    document.querySelector('[data-value=entrepreneur-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=entrepreneur-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);
}

function updateEmployee() {
    const salaryCalculation = getBruto2SalaryCalculation(bruto2);

    const taxPercentage = salaryCalculation.totalTax / salaryCalculation.bruto2;
    const netoPercentage = 1 - taxPercentage;
    const netoYearly = salaryCalculation.neto * 12;

    const yearlyTax = getYearlyTax(netoYearly);

    document.querySelector('[data-value=employee-bruto2]').innerText = formatAmount(salaryCalculation.bruto2);
    document.querySelector('[data-value=employee-pension-employer]').innerText = formatAmount(salaryCalculation.pensionEmployer);
    document.querySelector('[data-value=employee-health-employer]').innerText = formatAmount(salaryCalculation.healthEmployer);
    document.querySelector('[data-value=employee-bruto1]').innerText = formatAmount(salaryCalculation.bruto1);
    document.querySelector('[data-value=employee-contribution-base]').innerText = formatAmount(salaryCalculation.contributionBase);
    document.querySelector('[data-value=employee-income-tax]').innerText = formatAmount(salaryCalculation.incomeTax);
    document.querySelector('[data-value=employee-pension]').innerText = formatAmount(salaryCalculation.pension);
    document.querySelector('[data-value=employee-health]').innerText = formatAmount(salaryCalculation.health);
    document.querySelector('[data-value=employee-unemployment]').innerText = formatAmount(salaryCalculation.unemployment);
    document.querySelector('[data-value=employee-monthly-tax]').innerText = formatAmount(salaryCalculation.totalTax);
    document.querySelector('[data-value=employee-neto]').innerText = formatAmount(salaryCalculation.neto);
    document.querySelector('[data-value=employee-neto-foreign]').innerText = formatAmount(salaryCalculation.netoForeign);
    document.querySelector('[data-value=employee-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=employee-neto-percentage]').innerText = formatPercentage(netoPercentage);
    document.querySelector('.employee .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=employee-neto-yearly]').innerText = formatAmount(netoYearly);
    document.querySelector('[data-value=employee-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=employee-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);

}

function updateLlc() {
    const minMonthlySalary = parseFloat(document.getElementById('llc-minimal-neto-salary').value);
    let desiredMonthlyNeto = parseFloat(document.getElementById('llc-desired-monthly-neto').value);

    if (desiredMonthlyNeto < minMonthlySalary) {
        desiredMonthlyNeto = minMonthlySalary;
    }

    const salaryCalculation = getNetoSalaryCalculation(desiredMonthlyNeto);

    const profit = (bruto2 - salaryCalculation.bruto2) * 12;
    const yearlySalaryWithBonusBruto2 = bruto2 * 12 - 11 * salaryCalculation.bruto2;


    const salaryWithBonusCalculation = getBruto2SalaryCalculation(yearlySalaryWithBonusBruto2);

    const totalTax = salaryCalculation.totalTax * 11 + salaryWithBonusCalculation.totalTax;
    const yearlyNeto = bruto2 * 12 - totalTax;
    const yearlyNetoForeign = yearlyNeto / exchangeRate;
    const taxPercentage = totalTax / (bruto2 * 12);
    const netoPercentage = Math.min(1 - taxPercentage, 1);

    const yearlyTax = getYearlyTax(yearlyNeto);

    document.querySelector('[data-value=llc-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=llc-neto-percentage]').innerText = formatPercentage(netoPercentage);

    document.querySelector('[data-value=llc-monthly-bruto2]').innerText = formatAmount(salaryCalculation.bruto2);
    document.querySelector('[data-value=llc-monthly-pension]').innerText = formatAmount(salaryCalculation.pension + salaryCalculation.pensionEmployer);
    document.querySelector('[data-value=llc-monthly-health]').innerText = formatAmount(salaryCalculation.health + salaryCalculation.healthEmployer);
    document.querySelector('[data-value=llc-monthly-income-tax]').innerText = formatAmount(salaryCalculation.incomeTax);
    document.querySelector('[data-value=llc-monthly-unemployment]').innerText = formatAmount(salaryCalculation.unemployment);
    document.querySelector('[data-value=llc-monthly-tax]').innerText = formatAmount(salaryCalculation.totalTax);
    document.querySelector('[data-value=llc-monthly-neto]').innerText = formatAmount(salaryCalculation.neto);
    document.querySelector('[data-value=llc-monthly-neto-foreign]').innerText = formatAmount(salaryCalculation.netoForeign);

    document.querySelector('[data-value=llc-profit]').innerText = formatAmount(profit);

    document.querySelector('[data-value=llc-bonus-bruto2]').innerText = formatAmount(salaryWithBonusCalculation.bruto2);
    document.querySelector('[data-value=llc-bonus-pension]').innerText = formatAmount(salaryWithBonusCalculation.pension + salaryWithBonusCalculation.pensionEmployer);
    document.querySelector('[data-value=llc-bonus-health]').innerText = formatAmount(salaryWithBonusCalculation.health + salaryWithBonusCalculation.healthEmployer);
    document.querySelector('[data-value=llc-bonus-income-tax]').innerText = formatAmount(salaryWithBonusCalculation.incomeTax);
    document.querySelector('[data-value=llc-bonus-unemployment]').innerText = formatAmount(salaryWithBonusCalculation.unemployment);
    document.querySelector('[data-value=llc-bonus-tax]').innerText = formatAmount(salaryWithBonusCalculation.totalTax);
    document.querySelector('[data-value=llc-bonus-neto]').innerText = formatAmount(salaryWithBonusCalculation.neto);
    document.querySelector('[data-value=llc-bonus-neto-foreign]').innerText = formatAmount(salaryWithBonusCalculation.netoForeign);

    document.querySelector('.llc .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=llc-average-monthly-tax]').innerText = formatAmount(totalTax / 12);
    document.querySelector('[data-value=llc-average-neto-monthly]').innerText = formatAmount(yearlyNeto / 12);
    document.querySelector('[data-value=llc-average-neto-monthly-foreign]').innerText = formatAmount(yearlyNetoForeign / 12);
    document.querySelector('[data-value=llc-neto-yearly]').innerText = formatAmount(yearlyNeto);
    document.querySelector('[data-value=llc-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=llc-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);
}

function updateLlcDividend() {
    const minMonthlySalary = parseFloat(document.getElementById('llc-minimal-neto-salary').value);
    let desiredMonthlyNeto = parseFloat(document.getElementById('llc-dividend-desired-monthly-neto').value);

    if (desiredMonthlyNeto < minMonthlySalary) {
        desiredMonthlyNeto = minMonthlySalary;
    }

    const salaryCalculation = getNetoSalaryCalculation(desiredMonthlyNeto);

    const profit = (bruto2 - salaryCalculation.bruto2) * 12;
    const profitTax = profit  * taxes.llc.profit;
    const profitAfterTax = profit - profitTax;
    const dividendTax = profitAfterTax * taxes.llc.dividend;

    const totalTax = salaryCalculation.totalTax * 12 + profitTax + dividendTax;
    const yearlyNeto = bruto2 * 12 - totalTax;
    const yearlyNetoForeign = yearlyNeto / exchangeRate;
    const taxPercentage = totalTax / (bruto2 * 12);
    const netoPercentage = Math.min(1 - taxPercentage, 1);

    // Dividends are not taken into account when calculating yearly tax
    const yearlyTax = getYearlyTax(desiredMonthlyNeto * 12);

    document.querySelector('[data-value=llc-dividend-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=llc-dividend-neto-percentage]').innerText = formatPercentage(netoPercentage);

    document.querySelector('[data-value=llc-dividend-monthly-bruto2]').innerText = formatAmount(salaryCalculation.bruto2);
    document.querySelector('[data-value=llc-dividend-monthly-pension]').innerText = formatAmount(salaryCalculation.pension + salaryCalculation.pensionEmployer);
    document.querySelector('[data-value=llc-dividend-monthly-health]').innerText = formatAmount(salaryCalculation.health + salaryCalculation.healthEmployer);
    document.querySelector('[data-value=llc-dividend-monthly-income-tax]').innerText = formatAmount(salaryCalculation.incomeTax);
    document.querySelector('[data-value=llc-dividend-monthly-unemployment]').innerText = formatAmount(salaryCalculation.unemployment);
    document.querySelector('[data-value=llc-dividend-monthly-tax]').innerText = formatAmount(salaryCalculation.totalTax);
    document.querySelector('[data-value=llc-dividend-monthly-neto]').innerText = formatAmount(salaryCalculation.neto);
    document.querySelector('[data-value=llc-dividend-monthly-neto-foreign]').innerText = formatAmount(salaryCalculation.netoForeign);

    document.querySelector('[data-value=llc-dividend-profit-before-tax]').innerText = formatAmount(profit);
    document.querySelector('[data-value=llc-dividend-profit-tax]').innerText = formatAmount(profitTax);
    document.querySelector('[data-value=llc-dividend-profit-tax-percentage]').innerText = formatPercentage(taxes.llc.profit);
    document.querySelector('[data-value=llc-dividend-profit-after-tax]').innerText = formatAmount(profitAfterTax);
    document.querySelector('[data-value=llc-dividend-dividend-tax]').innerText = formatAmount(dividendTax);
    document.querySelector('[data-value=llc-dividend-dividend-tax-percentage]').innerText = formatPercentage(taxes.llc.dividend);

    document.querySelector('.llc-dividend .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=llc-dividend-average-monthly-tax]').innerText = formatAmount(totalTax / 12);
    document.querySelector('[data-value=llc-dividend-average-neto-monthly]').innerText = formatAmount(yearlyNeto / 12);
    document.querySelector('[data-value=llc-dividend-average-neto-monthly-foreign]').innerText = formatAmount(yearlyNetoForeign / 12);
    document.querySelector('[data-value=llc-dividend-neto-yearly]').innerText = formatAmount(yearlyNeto);
    document.querySelector('[data-value=llc-dividend-yearly-tax-under-40]').innerText = formatAmount(yearlyTax.totalUnder40);
    document.querySelector('[data-value=llc-dividend-yearly-tax-over-40]').innerText = formatAmount(yearlyTax.totalOver40);
}

function getYearlyTax(yearlyNetoSalary) {
    const averageYearlyBrutoSalary = parseFloat(document.getElementById('average-yearly-bruto-salary').value);

    const untaxableIncome = averageYearlyBrutoSalary * 3;
    const personalDeduction = averageYearlyBrutoSalary * 0.4;
    const under40BenefitDeduction = averageYearlyBrutoSalary * 3;
    const taxRate2Limit = averageYearlyBrutoSalary * 6;

    const taxableIncomeUnder40 = Math.max(yearlyNetoSalary - untaxableIncome - under40BenefitDeduction, 0);
    const taxableIncomeOver40 = Math.max(yearlyNetoSalary - untaxableIncome, 0);

    const taxableIncomeUnder40AfterDeduction = Math.max(taxableIncomeUnder40 - personalDeduction, 0);
    const taxableIncomeOver40AfterDeduction = Math.max(taxableIncomeOver40 - personalDeduction, 0);

    const rate1TaxBaseUnder40 = Math.min(taxableIncomeUnder40AfterDeduction, taxRate2Limit);
    const rate1TaxBaseOver40 = Math.min(taxableIncomeOver40AfterDeduction, taxRate2Limit);

    const rate2TaxBaseUnder40 = Math.max(taxableIncomeUnder40 - taxRate2Limit, 0);
    const rate2TaxBaseOver40 = Math.max(taxableIncomeOver40 - taxRate2Limit, 0);

    const rate1TaxUnder40 = rate1TaxBaseUnder40 * taxes.yearly.rate1;
    const rate1TaxOver40 = rate1TaxBaseOver40 * taxes.yearly.rate1;
    const rate2TaxUnder40 = rate2TaxBaseUnder40 * taxes.yearly.rate2;
    const rate2TaxOver40 = rate2TaxBaseOver40 * taxes.yearly.rate2;

    const totalUnder40 = rate1TaxUnder40 + rate2TaxUnder40;
    const totalOver40 = rate1TaxOver40 + rate2TaxOver40;

    return {
        taxableIncomeUnder40AfterDeduction,
        rate1TaxUnder40,
        rate2TaxUnder40,
        totalUnder40,

        taxableIncomeOver40AfterDeduction,
        rate1TaxOver40,
        rate2TaxOver40,
        totalOver40,
    };
}

function getNetoSalaryCalculation(netoSalary) {
    const minContributionBase = parseFloat(contributionBaseMinField.value);
    const maxContributionBase = parseFloat(document.getElementById('contribution-base-max').value);
    const untaxableIncome = parseFloat(document.getElementById('untaxable-income').value);

    let bruto1 = (netoSalary - untaxableIncome * taxes.employee.income) /
        (1 - taxes.employee.income - taxes.employee.health - taxes.employee.pension - taxes.employee.unemployment);

    let contributionBase = bruto1;

    if (contributionBase > maxContributionBase) {
        bruto1 = (netoSalary - untaxableIncome * taxes.employee.income + maxContributionBase * (taxes.employee.health + taxes.employee.pension + taxes.employee.unemployment)) /
            (1 - taxes.employee.income);

        contributionBase = maxContributionBase;
    }

    if (contributionBase < minContributionBase) {
        contributionBase = minContributionBase;
    }

    const incomeTax = (bruto1 - untaxableIncome) * taxes.employee.income;
    const pension = contributionBase * taxes.employee.pension;
    const health = contributionBase * taxes.employee.health;
    const unemployment = contributionBase * taxes.employee.unemployment;

    const pensionEmployer = contributionBase * taxes.employee.pensionEmployer;
    const healthEmployer = contributionBase * taxes.employee.healthEmployer;

    const totalTax = incomeTax + pension + health + unemployment + pensionEmployer + healthEmployer;
    const bruto2 = netoSalary + totalTax;
    const netoForeign = netoSalary / exchangeRate;

    return {
        neto: netoSalary,
        netoForeign,
        contributionBase,
        incomeTax,
        pension,
        health,
        unemployment,
        bruto1,
        pensionEmployer,
        healthEmployer,
        bruto2,
        totalTax,
    };
}

function getBruto2SalaryCalculation(bruto2Salary) {
    const minContributionBase = parseFloat(contributionBaseMinField.value);
    const maxContributionBase = parseFloat(document.getElementById('contribution-base-max').value);
    const untaxableIncome = parseFloat(document.getElementById('untaxable-income').value);

    let contributionBase = bruto2Salary / (1 + taxes.employee.healthEmployer + taxes.employee.pensionEmployer);
    if (contributionBase > maxContributionBase) {
        contributionBase = maxContributionBase;
    }

    if (contributionBase < minContributionBase) {
        contributionBase = minContributionBase;
    }

    const pensionEmployer = contributionBase * taxes.employee.pensionEmployer;
    const healthEmployer = contributionBase * taxes.employee.healthEmployer;

    const bruto1 = bruto2Salary - pensionEmployer - healthEmployer;
    const incomeTax = (bruto1 - untaxableIncome) * taxes.employee.income;
    const pension = contributionBase * taxes.employee.pension;
    const health = contributionBase * taxes.employee.health;
    const unemployment = contributionBase * taxes.employee.unemployment;

    const totalTax = pensionEmployer + healthEmployer + incomeTax + pension + health + unemployment;

    const neto = bruto2Salary - totalTax;
    const netoForeign = neto / exchangeRate;

    return {
        neto,
        netoForeign,
        contributionBase,
        incomeTax,
        pension,
        health,
        unemployment,
        bruto1,
        pensionEmployer,
        healthEmployer,
        bruto2: bruto2Salary,
        totalTax,
    };
}

function updateLabels() {
    document.querySelector('[data-value=freelancer1-income-tax-percentage]').innerText = formatPercentage(taxes.freelancer1.income);
    document.querySelector('[data-value=freelancer1-pension-percentage]').innerText = formatPercentage(taxes.freelancer1.pension);
    document.querySelector('[data-value=freelancer1-health-percentage]').innerText = formatPercentage(taxes.freelancer1.health);

    const freelancer2StandardizedCostsBase = parseFloat(document.getElementById('freelancer2-standardized-costs').value);
    document.querySelector('[data-value=freelancer2-standardized-costs-base]').innerText = formatAmount(freelancer2StandardizedCostsBase);
    document.querySelector('[data-value=freelancer2-income-tax-percentage]').innerText = formatPercentage(taxes.freelancer2.income);
    document.querySelector('[data-value=freelancer2-pension-percentage]').innerText = formatPercentage(taxes.freelancer2.pension);
    document.querySelector('[data-value=freelancer2-health-percentage]').innerText = formatPercentage(taxes.freelancer2.health);

    document.querySelector('[data-value=entrepreneur-income-tax-percentage]').innerText = formatPercentage(taxes.entrepreneur.income);
    document.querySelector('[data-value=entrepreneur-pension-percentage]').innerText = formatPercentage(taxes.entrepreneur.pension);
    document.querySelector('[data-value=entrepreneur-health-percentage]').innerText = formatPercentage(taxes.entrepreneur.health);
    document.querySelector('[data-value=entrepreneur-unemployment-percentage]').innerText = formatPercentage(taxes.entrepreneur.unemployment);
    document.querySelector('[data-value=entrepreneur-profit-tax-percentage]').innerText = formatPercentage(taxes.entrepreneur.profit);

    document.querySelector('[data-value=employee-pension-employer-percentage]').innerText = formatPercentage(taxes.employee.pensionEmployer);
    document.querySelector('[data-value=employee-health-employer-percentage]').innerText = formatPercentage(taxes.employee.healthEmployer);
    document.querySelector('[data-value=employee-income-tax-percentage]').innerText = formatPercentage(taxes.employee.income);
    document.querySelector('[data-value=employee-pension-percentage]').innerText = formatPercentage(taxes.employee.pension);
    document.querySelector('[data-value=employee-health-percentage]').innerText = formatPercentage(taxes.employee.health);
    document.querySelector('[data-value=employee-unemployment-percentage]').innerText = formatPercentage(taxes.employee.unemployment);
}

function updateValues() {
    exchangeRate = Number.parseFloat(exchangeRateField.value);
    bruto2Foreign = Number.parseFloat(bruto2ForeignField.value);

    if (!bruto2Foreign || !exchangeRate || bruto2Foreign < 100) {
        return;
    }

    updateSalaries();
    updateFreelancer1();
    updateFreelancer2();
    updateLumpSum();
    updateEntrepreneur();
    updateEmployee();
    updateLlc();
    updateLlcDividend();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="number"]').forEach((element) => {
        element.addEventListener('blur', (event) => {
            if (!event.currentTarget.value) {
                return;
            }

            event.currentTarget.value = Number.parseFloat(event.currentTarget.value).toFixed(2);
        });
    });

    entrepreneurSalaryField.value = contributionBaseMinField.value;
    entrepreneurSalaryField.setAttribute('min', contributionBaseMinField.value);
    contributionBaseMinField.addEventListener('input', () => {
        entrepreneurSalaryField.setAttribute('min', contributionBaseMinField.value);
    });

    llcSalaryField.value = minimalNetoSalaryField.value;
    llcDividendSalaryField.value = minimalNetoSalaryField.value;
    llcSalaryField.setAttribute('min', minimalNetoSalaryField.value);
    llcDividendSalaryField.setAttribute('min', minimalNetoSalaryField.value);
    minimalNetoSalaryField.addEventListener('input', () => {
        llcSalaryField.setAttribute('min', minimalNetoSalaryField.value);
        llcDividendSalaryField.setAttribute('min', minimalNetoSalaryField.value);
    });

    exchangeRateField.addEventListener('input', updateValues);
    bruto2ForeignField.addEventListener('input', updateValues);

    document.querySelectorAll('.settings input').forEach((element) => {
        element.addEventListener('input', updateValues);
        element.addEventListener('input', updateLabels);
    });

    lumpSumTaxField.addEventListener('input', updateLumpSum);
    entrepreneurSalaryField.addEventListener('input', updateEntrepreneur);
    entrepreneurExpensesField.addEventListener('input', updateEntrepreneur);
    llcSalaryField.addEventListener('input', updateLlc);
    llcDividendSalaryField.addEventListener('input', updateLlcDividend);

    updateLabels();
    updateValues();

    document.querySelectorAll('.section .heading').forEach((element) => {
        element.addEventListener('click', (event) => {
            event.currentTarget.parentElement.classList.toggle('open');
        })
    })
});