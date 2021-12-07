import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { location } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const equipmentProposalRepo = RepoFactory.equipmentProposalRepo;

export const state = () => ({
  equipmentProposals: [] as any[],
});

export const mutations = mutationTree(state, {
  SET_PROPOSALS(state, equipmentProposal: location[]) {
    state.equipmentProposals = equipmentProposal;
  },
  SET_PROPOSAL(state, location: location) {
    state.equipmentProposals.push(location);
  },
  DELETE_PROPOSAL(state, location: location) {
    state.equipmentProposals = state.equipmentProposals.filter(
      (l) => l._id !== location._id
    );
  },
  UPDATE_PROPOSAL(state, location: location) {
    const index = state.equipmentProposals.findIndex(
      (l) => l._id === location._id
    );
    state.equipmentProposals[index] = location;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async getEquipmentProposal(context) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.getEquipmentProposals(this)
      );
      if (res && res.data) {
        context.commit("SET_PROPOSALS", res.data);
      }
    },
    async deleteEquipmentProposal(context, id: string) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.deleteEquipmentProposal(this, id)
      );
      if (res) {
        context.commit("DELETE_PROPOSAL", res.data);
      }
    },
    async createEquipmentProposal(context, location: location) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.createEquipmentProposal(this, location)
      );
      if (res && res.data) {
        context.commit("SET_PROPOSAL", res.data);
      }
    },
  }
);
