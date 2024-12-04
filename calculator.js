const exchangeRateField = document.getElementById('exchange-rate');
const bruto2ForeignField = document.getElementById('bruto2-foreign');
const lumpSumTaxField = document.getElementById('lump-sum-tax');
const entrepreneurSalaryField = document.getElementById('entrepreneur-salary');
const entrepreneurExpensesField = document.getElementById('entrepreneur-expenses');

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
}

function updateFreelancer2() {
    const quarterlyEarnings = bruto2 * 3;
    const standardizedCosts = parseFloat(document.getElementById('freelancer2-standardized-costs').value) + quarterlyEarnings * 0.34;
    const minimalHealthContribution = parseFloat(document.getElementById('freelancer-minimal-health').value);
    const contributionBaseMin = parseFloat(document.getElementById('contribution-base-min').value);

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
}

function updateLumpSum() {
    const yearlyLimit = 6000000;

    let monthlyTax = '-';
    let neto = '-';
    let netoForeign = '-';
    let taxPercentage = '';
    let netoPercentage = '';
    let netoYearly = '-';

    const yearlyEarnings = bruto2 * 12;

    if (yearlyEarnings < yearlyLimit) {
        monthlyTax =  parseFloat(document.getElementById('lump-sum-tax').value);
        neto = bruto2 - monthlyTax;
        netoForeign = neto / exchangeRate;
        taxPercentage = monthlyTax / bruto2;
        netoPercentage = 1 - taxPercentage;
        netoYearly = neto * 12;

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
}

function updateEntrepreneur() {
    const salary = parseFloat(document.getElementById('entrepreneur-salary').value);
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
}

function updateEmployee() {
    const minContributionBase = parseFloat(document.getElementById('contribution-base-min').value);
    const maxContributionBase = parseFloat(document.getElementById('contribution-base-max').value);
    const untaxableIncome = parseFloat(document.getElementById('untaxable-income').value);

    let contributionBase = bruto2 / (1 + taxes.employee.healthEmployer + taxes.employee.pensionEmployer);
    if (contributionBase > maxContributionBase) {
        contributionBase = maxContributionBase;
    }

    if (contributionBase < minContributionBase) {
        contributionBase = minContributionBase;
    }

    const pensionEmployer = contributionBase * taxes.employee.pensionEmployer;
    const healthEmployer = contributionBase * taxes.employee.healthEmployer;

    const bruto1 = bruto2 - pensionEmployer - healthEmployer;
    const incomeTax = (bruto1 - untaxableIncome) * taxes.employee.income;
    const pension = contributionBase * taxes.employee.pension;
    const health = contributionBase * taxes.employee.health;
    const unemployment = contributionBase * taxes.employee.unemployment;

    const monthlyTax = pensionEmployer + healthEmployer + incomeTax + pension + health + unemployment;

    const neto = bruto2 - monthlyTax;
    const netoForeign = neto / exchangeRate;
    const taxPercentage = monthlyTax / bruto2;
    const netoPercentage = 1 - taxPercentage;
    const netoYearly = neto * 12;

    document.querySelector('[data-value=employee-bruto2]').innerText = formatAmount(bruto2);
    document.querySelector('[data-value=employee-pension-employer]').innerText = formatAmount(pensionEmployer);
    document.querySelector('[data-value=employee-health-employer]').innerText = formatAmount(healthEmployer);
    document.querySelector('[data-value=employee-bruto1]').innerText = formatAmount(bruto1);
    document.querySelector('[data-value=employee-contribution-base]').innerText = formatAmount(contributionBase);
    document.querySelector('[data-value=employee-income-tax]').innerText = formatAmount(incomeTax);
    document.querySelector('[data-value=employee-pension]').innerText = formatAmount(pension);
    document.querySelector('[data-value=employee-health]').innerText = formatAmount(health);
    document.querySelector('[data-value=employee-unemployment]').innerText = formatAmount(unemployment);
    document.querySelector('[data-value=employee-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=employee-neto]').innerText = formatAmount(neto);
    document.querySelector('[data-value=employee-neto-foreign]').innerText = formatAmount(netoForeign);
    document.querySelector('[data-value=employee-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=employee-neto-percentage]').innerText = formatPercentage(netoPercentage);
    document.querySelector('.employee .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=employee-neto-yearly]').innerText = formatAmount(netoYearly);

}

function updateLlc() {
    const minContributionBase = parseFloat(document.getElementById('contribution-base-min').value);
    const maxContributionBase = parseFloat(document.getElementById('contribution-base-max').value);
    const minMonthlySalary = parseFloat(document.getElementById('llc-minimal-neto-salary').value);
    const untaxableIncome = parseFloat(document.getElementById('untaxable-income').value);
    let desiredMonthlyNeto = parseFloat(document.getElementById('llc-desired-monthly-neto').value);

    if (desiredMonthlyNeto < minMonthlySalary) {
        desiredMonthlyNeto = minMonthlySalary;
    }
    
    let monthlyContributionBase = (desiredMonthlyNeto - untaxableIncome * taxes.employee.income) /
            (1 - taxes.employee.income - taxes.employee.health - taxes.employee.pension - taxes.employee.unemployment);

    if (monthlyContributionBase > maxContributionBase) {
        monthlyContributionBase = maxContributionBase;
    }

    if (monthlyContributionBase < minContributionBase) {
        monthlyContributionBase = minContributionBase;
    }

    const monthlyPensionEmployer = monthlyContributionBase * taxes.employee.pensionEmployer;
    const monthlyHealthEmployer = monthlyContributionBase * taxes.employee.healthEmployer;
    
    const monthlyIncomeTax = (monthlyContributionBase - untaxableIncome) * taxes.employee.income;
    const monthlyPension = monthlyContributionBase * taxes.employee.pension;
    const monthlyHealth = monthlyContributionBase * taxes.employee.health;
    const monthlyUnemployment = monthlyContributionBase * taxes.employee.unemployment;

    const monthlyTax = monthlyPensionEmployer + monthlyHealthEmployer + monthlyIncomeTax + monthlyPension + monthlyHealth + monthlyUnemployment;
    const monthlyBruto2 = desiredMonthlyNeto + monthlyTax;
    const monthlyNetoForeign = desiredMonthlyNeto / exchangeRate;

    const profit = (bruto2 - monthlyBruto2) * 12;
    const yearlySalaryWithBonusBruto2 = bruto2 * 12 - 11 * monthlyBruto2;

    let yearlySalaryWithBonusContributionBase = yearlySalaryWithBonusBruto2 / (1 + taxes.employee.healthEmployer + taxes.employee.pensionEmployer);

    if (yearlySalaryWithBonusContributionBase > maxContributionBase) {
        yearlySalaryWithBonusContributionBase = maxContributionBase;
    }

    const yearlySalaryWithBonusPensionEmployer = yearlySalaryWithBonusContributionBase * taxes.employee.pensionEmployer;
    const yearlySalaryWithBonusHealthEmployer = yearlySalaryWithBonusContributionBase * taxes.employee.healthEmployer;

    const yearlySalaryWithBonusBruto1 = yearlySalaryWithBonusBruto2 - yearlySalaryWithBonusPensionEmployer - yearlySalaryWithBonusHealthEmployer;
    const yearlySalaryWithBonusIncomeTax = (yearlySalaryWithBonusBruto1 - untaxableIncome) * taxes.employee.income;
    const yearlySalaryWithBonusPension = yearlySalaryWithBonusContributionBase * taxes.employee.pension;
    const yearlySalaryWithBonusHealth = yearlySalaryWithBonusContributionBase * taxes.employee.health;
    const yearlySalaryWithBonusUnemployment = yearlySalaryWithBonusContributionBase * taxes.employee.unemployment;

    const yearlySalaryWithBonusTax = yearlySalaryWithBonusPensionEmployer + yearlySalaryWithBonusHealthEmployer +
            yearlySalaryWithBonusIncomeTax + yearlySalaryWithBonusPension + yearlySalaryWithBonusHealth + yearlySalaryWithBonusUnemployment;

    const yearlySalaryWithBonusNeto = yearlySalaryWithBonusBruto2 - yearlySalaryWithBonusTax;
    const yearlySalaryWithBonusNetoForeign = yearlySalaryWithBonusNeto / exchangeRate;

    const totalTax = monthlyTax * 11 + yearlySalaryWithBonusTax;
    const yearlyNeto = bruto2 * 12 - totalTax;
    const yearlyNetoForeign = yearlyNeto / exchangeRate;
    const taxPercentage = totalTax / (bruto2 * 12);
    const netoPercentage = 1 - taxPercentage;

    document.querySelector('[data-value=llc-tax-percentage]').innerText = formatPercentage(taxPercentage);
    document.querySelector('[data-value=llc-neto-percentage]').innerText = formatPercentage(netoPercentage);

    document.querySelector('[data-value=llc-monthly-bruto2]').innerText = formatAmount(monthlyBruto2);
    document.querySelector('[data-value=llc-monthly-pension]').innerText = formatAmount(monthlyPension + monthlyPensionEmployer);
    document.querySelector('[data-value=llc-monthly-health]').innerText = formatAmount(monthlyHealth + monthlyHealthEmployer);
    document.querySelector('[data-value=llc-monthly-income-tax]').innerText = formatAmount(monthlyIncomeTax);
    document.querySelector('[data-value=llc-monthly-unemployment]').innerText = formatAmount(monthlyUnemployment);
    document.querySelector('[data-value=llc-monthly-tax]').innerText = formatAmount(monthlyTax);
    document.querySelector('[data-value=llc-monthly-neto]').innerText = formatAmount(desiredMonthlyNeto);
    document.querySelector('[data-value=llc-monthly-neto-foreign]').innerText = formatAmount(monthlyNetoForeign);

    document.querySelector('[data-value=llc-profit]').innerText = formatAmount(profit);

    document.querySelector('[data-value=llc-bonus-bruto2]').innerText = formatAmount(yearlySalaryWithBonusBruto2);
    document.querySelector('[data-value=llc-bonus-pension]').innerText = formatAmount(yearlySalaryWithBonusPension);
    document.querySelector('[data-value=llc-bonus-health]').innerText = formatAmount(yearlySalaryWithBonusHealth);
    document.querySelector('[data-value=llc-bonus-income-tax]').innerText = formatAmount(yearlySalaryWithBonusIncomeTax);
    document.querySelector('[data-value=llc-bonus-unemployment]').innerText = formatAmount(yearlySalaryWithBonusUnemployment);
    document.querySelector('[data-value=llc-bonus-tax]').innerText = formatAmount(yearlySalaryWithBonusTax);
    document.querySelector('[data-value=llc-bonus-neto]').innerText = formatAmount(yearlySalaryWithBonusNeto);
    document.querySelector('[data-value=llc-bonus-neto-foreign]').innerText = formatAmount(yearlySalaryWithBonusNetoForeign);

    document.querySelector('.llc .bar span').style.width = `${netoPercentage * 100}%`;
    document.querySelector('[data-value=llc-average-monthly-tax]').innerText = formatAmount(totalTax / 12);
    document.querySelector('[data-value=llc-average-neto-monthly]').innerText = formatAmount(yearlyNeto / 12);
    document.querySelector('[data-value=llc-average-neto-monthly-foreign]').innerText = formatAmount(yearlyNetoForeign / 12);
    document.querySelector('[data-value=llc-neto-yearly]').innerText = formatAmount(yearlyNeto);
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

    document.getElementById('llc-desired-monthly-neto').value = document.getElementById('llc-minimal-neto-salary').value;

    updateLabels();
    updateValues();

    exchangeRateField.addEventListener('input', updateValues);
    bruto2ForeignField.addEventListener('input', updateValues);

    document.querySelectorAll('.settings input').forEach((element) => {
        element.addEventListener('input', updateValues);
        element.addEventListener('input', updateLabels);
    });

    document.getElementById('llc-minimal-neto-salary').addEventListener('input', () => {
        document.getElementById('llc-desired-monthly-neto').value = document.getElementById('llc-minimal-neto-salary').value;
    });

    document.querySelectorAll('.llc input').forEach((element) => {
        element.addEventListener('input', updateLlc);
    });

    lumpSumTaxField.addEventListener('input', updateLumpSum);

    entrepreneurSalaryField.addEventListener('input', updateEntrepreneur);
    entrepreneurExpensesField.addEventListener('input', updateEntrepreneur);

    document.querySelectorAll('.section .heading').forEach((element) => {
        element.addEventListener('click', (event) => {
            event.currentTarget.parentElement.classList.toggle('open');
        })
    })
})