import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { REGION } from './mail';

// Endpoint public visé par le lien de désabonnement (GET, sujet à un clic
// humain) et par l'en-tête List-Unsubscribe-Post (POST, un clic dans Gmail /
// Yahoo / Apple Mail). Query/corps : s=<id abonné>, t=<jeton>. Utilise le SDK
// admin, donc contourne les règles Firestore (la collection reste illisible
// au public) tout en supportant le désabonnement en libre-service.
function page(titre: string, corps: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${titre} · Xena Horizon</title>
<style>body{margin:0;background:#f6f1e9;color:#211d18;font-family:Georgia,'Times New Roman',serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
main{max-width:440px;text-align:center}h1{font-size:22px;font-weight:500;margin:0 0 12px}p{font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#6e655b}</style>
</head><body><main><h1>${titre}</h1><p>${corps}</p></main></body></html>`;
}

export const desabonner = onRequest(
  { region: REGION, cors: true, timeoutSeconds: 30 },
  async (req, res) => {
    const q = req.method === 'POST' ? (req.body || {}) : req.query;
    const s = String(q.s || '').trim();
    const t = String(q.t || '').trim();
    if (!s || !t) { res.status(400).send(page('Lien invalide', 'Ce lien de désabonnement est incomplet.')); return; }

    try {
      const ref = getFirestore().doc(`subscribers/${s}`);
      const snap = await ref.get();
      const data = snap.data() as { unsubscribeToken?: string; email?: string } | undefined;
      if (!snap.exists || !data?.unsubscribeToken || data.unsubscribeToken !== t) {
        res.status(404).send(page('Lien invalide', 'Ce lien de désabonnement n’est plus valide.'));
        return;
      }
      await ref.update({ status: 'unsubscribed', unsubscribedAt: Timestamp.now() });
      if (req.method === 'POST') { res.status(200).send('ok'); return; }
      res.status(200).send(page('Désabonnement confirmé', `${data.email || 'Cette adresse'} ne recevra plus l’infolettre de Xena Horizon.`));
    } catch (err) {
      console.error('[desabonner]', err);
      res.status(500).send(page('Erreur', 'Une erreur est survenue. Réessayez plus tard.'));
    }
  },
);
