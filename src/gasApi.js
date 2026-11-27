export const GAS_URL = "https://script.google.com/macros/s/AKfycbzP-8tZfB4d2CiRLYV2wfTqrfGhPQSA8BpSbBh3uSviFH2RoMsWink_mieAPo8TZitP/exec";

export const timKopiApi = {
  async getInitData() {
    const res = await fetch(`${GAS_URL}?action=getInitData`);
    return res.json();
  },

  async getAdminData() {
    const res = await fetch(`${GAS_URL}?action=getAdminData`);
    return res.json();
  },

  async postAction(payload) {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
