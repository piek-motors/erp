import { type KDB } from '../schema';

export async function up(db: KDB): Promise<void> {
    const details = await db.selectFrom('pdo.details').select(['id', 'automatic_writeoff']).execute();
    
    for (const detail of details) {
        if (detail.automatic_writeoff?.material) {
            const old = detail.automatic_writeoff.material as any;
            const costInMeters = old.length / 1000;
            const roundedCost = Math.round(costInMeters * 1000) / 1000;
            await db
                .updateTable('pdo.details')
                .set({ automatic_writeoff: {
                    ...detail.automatic_writeoff,
                    material: [old.material_id, roundedCost]
                } })
                .where('id', '=', detail.id)
                .execute();
        }
    }
}

export async function down(db: KDB): Promise<void> {
    const details = await db.selectFrom('pdo.details').select(['id', 'automatic_writeoff']).execute();

    for (const detail of details) {
        if (detail.automatic_writeoff?.material) {
            const old = detail.automatic_writeoff.material as any;
            const lengthInMillimeters = Math.round(old[1] * 1000);
            await db
                .updateTable('pdo.details')
                .set({ automatic_writeoff: {
                    ...detail.automatic_writeoff,
                    material: {
                        material_id: old[0],
                        length: lengthInMillimeters
                    } as any
                } })
                .where('id', '=', detail.id)
                .execute();
        }
    }
}
