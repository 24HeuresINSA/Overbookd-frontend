import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { location } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const equipmentProposalRepo = RepoFactory.equipmentProposalRepo;

export const state = () => ({
  equipmentProposals: [] as any[],
});

export const mutations = mutationTree(state, {
  SET_PROPOSALS(state, equipmentProposal: any[]) {
    state.equipmentProposals = equipmentProposal;
  },
  SET_PROPOSAL(state, equipmentProposal: any) {
    state.equipmentProposals.push(equipmentProposal);
  },
  DELETE_PROPOSAL(state, equipmentProposal: any) {
    state.equipmentProposals = state.equipmentProposals.filter(
      (l) => l._id !== equipmentProposal._id
    );
  },
  UPDATE_PROPOSAL(state, equipmentProposal: any) {
    const index = state.equipmentProposals.findIndex(
      (l) => l._id === equipmentProposal._id
    );
    state.equipmentProposals[index] = equipmentProposal;
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
    async createEquipmentProposal(context, eq: any) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.createEquipmentProposal(this, eq)
      );
      if (res && res.data) {
        context.commit("SET_PROPOSAL", res.data);
      }
    },
    async validateEquipmentProposal(context, equipmentProposal: any) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.validateEquipmentProposal(
          this,
          equipmentProposal._id
        )
      );
      if (res && res.data) {
        context.commit("UPDATE_PROPOSAL", res.data);
      }
    },
  }
);
