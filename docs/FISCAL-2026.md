# Paramètres fiscaux 2026 (module Taxes et impôt)

Constantes posées dans `lib/compta/fiscal-2026.ts`, lues le 2026-09-08. Surchargeables sans redéploiement
dans Firestore `settings/fiscal` (même forme que `ParametresFiscaux`, fusion partielle).

## Paliers d'imposition fédéraux 2026

| Revenu imposable | Taux |
|---|---|
| 0 $ à 58 523 $ | 14 % |
| 58 523 $ à 117 045 $ | 20,5 % |
| 117 045 $ à 181 440 $ | 26 % |
| 181 440 $ à 258 482 $ | 29 % |
| 258 482 $ et plus | 33 % |

Indexation 2026 : 2 %. Le taux du premier palier passe de 15 % à 14 % (baisse annoncée en 2025, pleinement
en vigueur pour l'année d'imposition 2026).

Montant personnel de base (MPB) fédéral : 16 452 $ pour un revenu net jusqu'à 181 440 $, réduit
linéairement jusqu'à un minimum de 14 829 $ à 258 482 $ et plus.

Sources : [canada.ca, taux et tranches](https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html) ·
[Yahoo Finance, chiffres CRA 2026](https://ca.finance.yahoo.com/news/cra-released-tax-numbers-2026-145834810.html) ·
[CalculQC, MPB fédéral 2026](https://calculqc.ca/blog/fiscalite/paliers-imposition-quebec-2026.html)

## Paliers d'imposition du Québec 2026

| Revenu imposable | Taux |
|---|---|
| 0 $ à 54 345 $ | 14 % |
| 54 345 $ à 108 680 $ | 19 % |
| 108 680 $ à 132 245 $ | 24 % |
| 132 245 $ et plus | 25,75 % |

Indexation 2026 : 2,05 %. Montant personnel de base québécois : 18 952 $ (pas de réduction à revenu élevé).

Sources : [Wealthsimple, paliers Québec 2026](https://www.wealthsimple.com/fr-ca/learn/quebec-tax-brackets) ·
[CalculQC, paliers Québec 2026](https://calculqc.ca/blog/fiscalite/paliers-imposition-quebec-2026.html)

## Abattement du Québec

16,5 % de l'impôt fédéral net (après crédits) est retranché : les Québécois financent une partie des
programmes fédéraux par leurs impôts provinciaux et reçoivent cette réduction en retour. Règle stable,
non indexée (art. 120 de la Loi de l'impôt sur le revenu).

## RRQ, travailleuse autonome, 2026

| Paramètre | Valeur |
|---|---|
| Exemption de base | 3 500 $ |
| Maximum des gains admissibles (MGA) | 74 600 $ |
| Maximum des gains admissibles supplémentaire (MGAS) | 85 000 $ |
| Taux de base (part autonome, déjà combinée employé + employeur) | 10,6 % |
| Taux de la 1re cotisation supplémentaire | 2 % |
| Taux de la 2e cotisation supplémentaire (sur la tranche MGA à MGAS) | 8 % |
| Cotisation maximale (base + 1re suppl.) | 8 958,60 $ |
| Cotisation maximale (2e suppl.) | 832 $ |

Traitement fiscal : la moitié du taux de base (5,3 %) est déductible du revenu, l'autre moitié donne
un crédit d'impôt non remboursable (aux deux paliers). Les cotisations supplémentaires (1re et 2e,
issues de la bonification du régime depuis 2019) sont entièrement déductibles du revenu, pas créditées.

Source : [Revenu Québec, MGA et taux de cotisation RRQ](https://www.revenuquebec.ca/fr/entreprises/retenues-a-la-source-et-cotisations-de-lemployeur/calcul-des-retenues-et-des-cotisations/cotisations-au-rrq/maximum-des-gains-admissibles-et-taux-de-cotisation/) ·
[Revenu Québec, ligne 248 (déduction/crédit)](https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/201-a-260-revenu-net/ligne-248/)

## RQAP, travailleuse autonome, 2026

| Paramètre | Valeur |
|---|---|
| Seuil minimal (aucune cotisation en dessous) | 2 000 $ |
| Revenu maximal assurable | 103 000 $ |
| Taux (part autonome, l'équivalent employé seulement) | 0,764 % |
| Cotisation maximale | 787,12 $ |

Une travailleuse autonome ne paie que la part « employée » du RQAP : la cotisation donne un crédit
d'impôt non remboursable, pas une déduction.

Source : [Québec.ca, baisse des taux RQAP 2026](https://www.quebec.ca/nouvelles/actualites/details/baisse-des-taux-de-cotisation-au-regime-quebecois-dassurance-parentale-en-2026) ·
[Revenu Québec, ligne 439](https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/400-a-447-impot-et-cotisations/ligne-439/)

## TPS, TVQ et acomptes provisionnels

- TPS 5 %, TVQ 9,975 %. Inscription obligatoire dès 30 000 $ de revenus dans les quatre trimestres
  civils qui se suivent (petit fournisseur en dessous).
- Acomptes provisionnels trimestriels exigés quand l'impôt net à payer dépasse, deux années de suite,
  3 000 $ au fédéral ou 1 800 $ au Québec (les deux paliers calculent et exigent séparément).
  Échéances : 15 mars, 15 juin, 15 septembre, 15 décembre.
- Prochaine échéance de production/paiement pour une travailleuse autonome (déclaration annuelle) :
  production au 15 juin, mais tout solde dû reste exigible au 30 avril (des intérêts courent entre le
  30 avril et le paiement même si la déclaration est produite en juin).

Source : [MaxRefund, acomptes provisionnels 2026](https://www.maxrefund.ca/fr/blog/tax-instalments-canada)
