import userRepo from "./userRepo";
import faRepo from "./faRepo";
import transactionRepo from "~/repositories/transactionRepo";
import equipmentRepo from "~/repositories/equipementRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
  equipment: equipmentRepo,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  transactionRepo,
  userRepo,
  faRepo,
  equipmentRepo,
};
