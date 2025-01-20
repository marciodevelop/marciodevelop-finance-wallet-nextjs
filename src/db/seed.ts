import { db } from "./index";
import { transactiontypes } from "./schema";

async function seedTransactionTypes() {
  try {
    console.log("Starting transaction types seeding...");

    const types = [
      {
        name: "DEPOSIT",
        description: "Depósito em conta"
      },
      {
        name: "TRANSFER",
        description: "Transferência entre contas"
      }
    ];

    for (const type of types) {
      const existingType = await db.query.transactiontypes.findFirst({
        where: (t, { eq }) => eq(t.name, type.name)
      });

      if (!existingType) {
        await db.insert(transactiontypes).values(type);
        console.log(`Created transaction type: ${type.name}`);
      } else {
        console.log(`Transaction type ${type.name} already exists, skipping...`);
      }
    }

    console.log("Transaction types seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding transaction types:", error);
    throw error;
  }
}

seedTransactionTypes()
  .catch((error) => {
    console.error("Failed to seed transaction types:", error);
    process.exit(1);
  });