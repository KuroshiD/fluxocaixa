import { BalanceSummary } from "../models/BalanceSummary";
import { Op } from 'sequelize';

async function getOrCreateTodaySummary(today: Date): Promise<BalanceSummary> {
    let summary = await BalanceSummary.findOne({
        where: { date: { [Op.gte]: today } },
        order: [['date', 'DESC']]
    });

    if (!summary) {
        summary = await BalanceSummary.findOne({ order: [['date', 'DESC']] }) ||
            await BalanceSummary.create({
                totalIncome: 0,
                totalExpense: 0,
                netResult: 0,
                currentBalance: 0,
                date: today
            } as any);
    }

    return summary;
}

type OperationType = 'venda' | 'compra' | 'taxa' | 'aluguel';

export async function updateBalanceSummary(opType: OperationType, amount: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    amount = parseFloat(amount.toString());

    const summary = await getOrCreateTodaySummary(today);

    const operationMap: Record<OperationType, { [key: string]: number }> = {
        venda: { totalIncome: amount, netResult: amount, currentBalance: amount },
        compra: { totalExpense: -amount, netResult: -amount, currentBalance: -amount },
        taxa: { totalExpense: -amount, netResult: -amount, currentBalance: -amount },
        aluguel: { totalExpense: -amount, netResult: -amount, currentBalance: -amount }
    };

    const updates = operationMap[opType];

    Object.keys(updates).forEach(key => {
        (summary as any)[key] = (parseFloat((summary as any)[key]) || 0) + updates[key];
    });

    console.log('Summary object before update:', JSON.stringify(summary));

    await summary.save();
}

export async function getSummariesInRange(startDate: Date, endDate: Date): Promise<BalanceSummary> {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate.getTime() === endDate.getTime()) {
        return await getOrCreateTodaySummary(startDate);
    }

    const summaries = await BalanceSummary.findAll({
        where: {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [['date', 'DESC']]
    });

    if (summaries.length === 0) {
        return await BalanceSummary.create({
            totalIncome: 0,
            totalExpense: 0,
            netResult: 0,
            currentBalance: 0,
            date: startDate
        } as any);
    }

    const accumulatedSummary = summaries.reduce((acc, summary) => {
        acc.totalIncome += parseFloat(summary.totalIncome.toString()) || 0;
        acc.totalExpense += parseFloat(summary.totalExpense.toString()) || 0;
        acc.netResult += parseFloat(summary.netResult.toString()) || 0;
        acc.currentBalance += parseFloat(summary.currentBalance.toString()) || 0;
        return acc;
    }, {
        totalIncome: 0,
        totalExpense: 0,
        netResult: 0,
        currentBalance: 0,
        date: startDate
    } as BalanceSummary);

    return accumulatedSummary;
}