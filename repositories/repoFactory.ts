import userRepo from "./userRepo";
import faRepo from "./faRepo";
import transactionRepo from "~/repositories/transactionRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  transactionRepo,
  userRepo,
  faRepo,
};
