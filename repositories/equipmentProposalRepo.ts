import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/equipment/proposal";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getEquipmentProposals(context: Context) {
    return context.$axios.get(resource);
  },
  createEquipmentProposal(context: Context, equipementProposal: any) {
    return context.$axios.post(resource, equipementProposal);
  },
  deleteEquipmentProposal(context: Context, id: string) {
    return context.$axios.delete(`${resource}/${id}`);
  },
};
