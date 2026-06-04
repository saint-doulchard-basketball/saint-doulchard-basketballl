import sys
import re

file_path = "c:\\Users\\mathi\\Documents\\SITE SDBB (1)\\inscription-2025-2026.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add CSS
css = """    <style>
        details.accordion {
            background: #fff;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        details.accordion summary {
            cursor: pointer;
            list-style: none;
            outline: none;
            position: relative;
            padding-right: 40px;
        }
        details.accordion summary::-webkit-details-marker {
            display: none;
        }
        details.accordion summary .section-title {
            margin-bottom: 0;
            margin-top: 0;
            padding-top: 0;
        }
        details.accordion summary::after {
            content: '\\f078';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary-color, #e53935);
            transition: transform 0.3s ease;
            font-size: 1.5rem;
        }
        details.accordion[open] summary::after {
            transform: translateY(-50%) rotate(180deg);
        }
        details.accordion > .accordion-content {
            padding-top: 20px;
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>

    <section class="content-section">"""

content = content.replace('    <section class="content-section">', css)

# Use regex to be resilient to small whitespace differences
def replace_section(content, search_str, replacement_str):
    return content.replace(search_str, replacement_str)

# Section Qui etes vous
old_sec_1 = """            <div class="section-title text-center animate-on-scroll mt-5">
                <h2>Qui êtes-vous ?</h2>
                <div class="underline center"></div>
            </div>

            <div class="grid-2 mt-4">
                <div class="member-card animate-on-scroll delay-100" style="text-align: left;">
                    <h3><i class="fas fa-user-plus" style="color:var(--primary-color);"></i> Nouveau licencié</h3>
                    <p class="mt-3">PASSER À UNE DES PERMANENCES ou envoyer par mail les informations suivantes :</p>
                    <ul class="check-list mt-3">
                        <li><i class="fas fa-angle-right"></i> Noms et prénoms du futur licencié</li>
                        <li><i class="fas fa-angle-right"></i> Date de naissance</li>
                        <li><i class="fas fa-angle-right"></i> Adresse mail à laquelle envoyer le lien de pré-inscription</li>
                    </ul>
                    <p class="mt-3">(DÉMARCHE CI-DESSOUS)</p>
                </div>

                <div class="member-card animate-on-scroll delay-200" style="text-align: left;">
                    <h3><i class="fas fa-user-check" style="color:var(--primary-color);"></i> Licencié de la saison 2024/2025</h3>
                    <p class="mt-3">VOUS AVEZ REÇU UN LIEN E-LICENCE (DÉMARCHE CI-DESSOUS).</p>
                    <p class="mt-3">Si ce n’est pas le cas, envoyez un mail.</p>
                </div>
            </div>
            <br>"""

new_sec_1 = """            <details class="accordion animate-on-scroll mt-5">
                <summary>
                    <div class="section-title text-center">
                        <h2>Qui êtes-vous ?</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="grid-2 mt-4">
                        <div class="member-card delay-100" style="text-align: left;">
                            <h3><i class="fas fa-user-plus" style="color:var(--primary-color);"></i> Nouveau licencié</h3>
                            <p class="mt-3">PASSER À UNE DES PERMANENCES ou envoyer par mail les informations suivantes :</p>
                            <ul class="check-list mt-3">
                                <li><i class="fas fa-angle-right"></i> Noms et prénoms du futur licencié</li>
                                <li><i class="fas fa-angle-right"></i> Date de naissance</li>
                                <li><i class="fas fa-angle-right"></i> Adresse mail à laquelle envoyer le lien de pré-inscription</li>
                            </ul>
                            <p class="mt-3">(DÉMARCHE CI-DESSOUS)</p>
                        </div>

                        <div class="member-card delay-200" style="text-align: left;">
                            <h3><i class="fas fa-user-check" style="color:var(--primary-color);"></i> Licencié de la saison 2024/2025</h3>
                            <p class="mt-3">VOUS AVEZ REÇU UN LIEN E-LICENCE (DÉMARCHE CI-DESSOUS).</p>
                            <p class="mt-3">Si ce n’est pas le cas, envoyez un mail.</p>
                        </div>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_1, new_sec_1)

# Section 1
old_sec_2 = """            <div class="section-title text-center animate-on-scroll mt-5" id="dematerialisation">
                <h2>1 – Dématérialisation de la licence : Comment ça marche ?</h2>

                <div class="underline center"></div>
            </div>

            <div class="content-section" style="padding-top: 0;">
                <div class="container">
                    <div class="member-card animate-on-scroll delay-100" style="text-align: left;">
                        <p class="mt-3">(démo en ligne) : <a href="https://youtu.be/DLAjRlDBxt4" target="_blank" rel="noopener">https://youtu.be/DLAjRlDBxt4</a></p>
                        <p class="mt-3">Les demandes de licence et de mutation « papier » n’existent plus. Elles sont remplacées par la saisie, par le licencié, sur une plateforme internet grâce à un lien internet reçu par mail.</p>

                        <h3 class="mt-4"><i class="fas fa-list-ol" style="color:var(--primary-color);"></i> LA DEMARCHE :</h3>
                        <ol class="check-list mt-3">
                            <li class="mt-2"><strong>Le club</strong> vous envoie un mail contenant un lien FFBB e-licence pour accéder au formulaire de saisie.</li>
                            <li class="mt-2">Vous cliquez sur ce lien, laissez-vous guider, remplissez les formulaires et téléchargez les documents demandés. Vous envoyez à ce moment-là votre pré-inscription. <br><em>(NB : vous pouvez interrompre votre saisie et la reprendre ultérieurement)</em></li>
                            <li class="mt-2">Vérifier d’être allé jusqu’au bout de la démarche (valider l’étape 6 !)</li>
                            <li class="mt-2">Le règlement de la licence se fera en ligne lors de votre pré-inscription (suivre les consignes Hello Asso) ou autre moyen de paiement afin de payer au club.</li>
                            <li class="mt-2">Le club vérifie vos informations saisies, les documents déposés ainsi que leur validité et votre règlement, valide votre licence qui sera ensuite vérifiée et validée par le Comité du Cher et la FFBB.</li>
                            <li class="mt-2">Vous recevez un mail avec votre licence dans un délai de <strong>15 jours</strong> après la validation par le club et le comité du Cher. (N’oubliez pas de télécharger cette licence !)</li>
                        </ol>
                    </div>
                </div>
            </div>
            <br>"""

new_sec_2 = """            <details class="accordion animate-on-scroll mt-5" id="dematerialisation">
                <summary>
                    <div class="section-title text-center">
                        <h2>1 – Dématérialisation de la licence : Comment ça marche ?</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="content-section" style="padding-top: 0;">
                        <div class="container" style="padding: 0;">
                            <div class="member-card delay-100" style="text-align: left;">
                                <p class="mt-3">(démo en ligne) : <a href="https://youtu.be/DLAjRlDBxt4" target="_blank" rel="noopener">https://youtu.be/DLAjRlDBxt4</a></p>
                                <p class="mt-3">Les demandes de licence et de mutation « papier » n’existent plus. Elles sont remplacées par la saisie, par le licencié, sur une plateforme internet grâce à un lien internet reçu par mail.</p>

                                <h3 class="mt-4"><i class="fas fa-list-ol" style="color:var(--primary-color);"></i> LA DEMARCHE :</h3>
                                <ol class="check-list mt-3">
                                    <li class="mt-2"><strong>Le club</strong> vous envoie un mail contenant un lien FFBB e-licence pour accéder au formulaire de saisie.</li>
                                    <li class="mt-2">Vous cliquez sur ce lien, laissez-vous guider, remplissez les formulaires et téléchargez les documents demandés. Vous envoyez à ce moment-là votre pré-inscription. <br><em>(NB : vous pouvez interrompre votre saisie et la reprendre ultérieurement)</em></li>
                                    <li class="mt-2">Vérifier d’être allé jusqu’au bout de la démarche (valider l’étape 6 !)</li>
                                    <li class="mt-2">Le règlement de la licence se fera en ligne lors de votre pré-inscription (suivre les consignes Hello Asso) ou autre moyen de paiement afin de payer au club.</li>
                                    <li class="mt-2">Le club vérifie vos informations saisies, les documents déposés ainsi que leur validité et votre règlement, valide votre licence qui sera ensuite vérifiée et validée par le Comité du Cher et la FFBB.</li>
                                    <li class="mt-2">Vous recevez un mail avec votre licence dans un délai de <strong>15 jours</strong> après la validation par le club et le comité du Cher. (N’oubliez pas de télécharger cette licence !)</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_2, new_sec_2)

# Section 2
old_sec_3 = """            <div class="section-title text-center animate-on-scroll mt-5" id="certificat-medical">
                <h2>2 – Le certificat médical</h2>

                <div class="underline center"></div>
            </div>

            <div class="grid-2 mt-4">
                <div class="member-card animate-on-scroll delay-100" style="text-align: left;">
                    <h3><i class="fas fa-stethoscope" style="color:var(--primary-color);"></i> Nouveau licencié majeur</h3>
                    <ul class="check-list mt-3">
                        <li><i class="fas fa-angle-right"></i> BESOIN D’UN CERTIFICAT MÉDICAL valable 3 ans</li>
                        <li><i class="fas fa-angle-right"></i> Notifié « basket en compétition » même en loisirs</li>
                    </ul>
                    <p class="mt-3">Lien du certificat médical : <em>à compléter selon document du club</em></p>
                </div>

                <div class="member-card animate-on-scroll delay-200" style="text-align: left;">
                    <h3><i class="fas fa-stethoscope" style="color:var(--primary-color);"></i> Licencié majeur saison 2024/2025</h3>
                    <ul class="check-list mt-3">
                        <li><i class="fas fa-angle-right"></i> Règle de validité de 3 ans maintenue</li>
                        <li><i class="fas fa-angle-right"></i> Possibilité de remplir le questionnaire de santé</li>
                        <li><i class="fas fa-angle-right"></i> Recommandation FFBB : visite médicale avant la prise de licence chaque année</li>
                    </ul>
                </div>
            </div>

            <div class="grid-2 mt-4">
                <div class="member-card animate-on-scroll delay-100" style="text-align: left;">
                    <h3><i class="fas fa-child" style="color:var(--primary-color);"></i> Licenciés mineurs (nouveaux ou anciens)</h3>
                    <ul class="check-list mt-3">
                        <li><i class="fas fa-angle-right"></i> REMPLIR LE QUESTIONNAIRE DE SANTÉ</li>
                        <li><i class="fas fa-angle-right"></i> Certificat médical plus obligatoire</li>
                    </ul>
                </div>

                <div class="member-card animate-on-scroll delay-200" style="text-align: left;">
                    <h3><i class="fas fa-user-tie" style="color:var(--primary-color);"></i> Équipes / Coaches non joueurs</h3>
                    <ul class="check-list mt-3">
                        <li><i class="fas fa-angle-right"></i> Les coachs d’équipe non joueurs n’ont plus l’obligation de produire un certificat médical</li>
                        <li><i class="fas fa-angle-right"></i> <a href="Document/Chatred'engagement.pdf" target="_blank" rel="noopener">Pour les seniors : saisir et signer la CHARTE D'ENGAGEMENT</a></li>
                    </ul>
                </div>
            </div>
            <br>"""

new_sec_3 = """            <details class="accordion animate-on-scroll mt-5" id="certificat-medical">
                <summary>
                    <div class="section-title text-center">
                        <h2>2 – Le certificat médical</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="grid-2 mt-4">
                        <div class="member-card delay-100" style="text-align: left;">
                            <h3><i class="fas fa-stethoscope" style="color:var(--primary-color);"></i> Nouveau licencié majeur</h3>
                            <ul class="check-list mt-3">
                                <li><i class="fas fa-angle-right"></i> BESOIN D’UN CERTIFICAT MÉDICAL valable 3 ans</li>
                                <li><i class="fas fa-angle-right"></i> Notifié « basket en compétition » même en loisirs</li>
                            </ul>
                            <p class="mt-3">Lien du certificat médical : <em>à compléter selon document du club</em></p>
                        </div>

                        <div class="member-card delay-200" style="text-align: left;">
                            <h3><i class="fas fa-stethoscope" style="color:var(--primary-color);"></i> Licencié majeur saison 2024/2025</h3>
                            <ul class="check-list mt-3">
                                <li><i class="fas fa-angle-right"></i> Règle de validité de 3 ans maintenue</li>
                                <li><i class="fas fa-angle-right"></i> Possibilité de remplir le questionnaire de santé</li>
                                <li><i class="fas fa-angle-right"></i> Recommandation FFBB : visite médicale avant la prise de licence chaque année</li>
                            </ul>
                        </div>
                    </div>

                    <div class="grid-2 mt-4">
                        <div class="member-card delay-100" style="text-align: left;">
                            <h3><i class="fas fa-child" style="color:var(--primary-color);"></i> Licenciés mineurs (nouveaux ou anciens)</h3>
                            <ul class="check-list mt-3">
                                <li><i class="fas fa-angle-right"></i> REMPLIR LE QUESTIONNAIRE DE SANTÉ</li>
                                <li><i class="fas fa-angle-right"></i> Certificat médical plus obligatoire</li>
                            </ul>
                        </div>

                        <div class="member-card delay-200" style="text-align: left;">
                            <h3><i class="fas fa-user-tie" style="color:var(--primary-color);"></i> Équipes / Coaches non joueurs</h3>
                            <ul class="check-list mt-3">
                                <li><i class="fas fa-angle-right"></i> Les coachs d’équipe non joueurs n’ont plus l’obligation de produire un certificat médical</li>
                                <li><i class="fas fa-angle-right"></i> <a href="Document/Chatred'engagement.pdf" target="_blank" rel="noopener">Pour les seniors : saisir et signer la CHARTE D'ENGAGEMENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_3, new_sec_3)

# Section 3
old_sec_4 = """            <div class="section-title text-center animate-on-scroll mt-5" id="documents">
                <h2>3 – Documents à télécharger</h2>

                <div class="underline center"></div>
            </div>

                <div class="member-card animate-on-scroll delay-100" style="text-align: left; margin-top: 25px;">
                <p class="mt-3">Télécharger la/les documents ci-dessous :</p>
                <ul class="check-list mt-3">
                    <li><i class="fas fa-angle-right"></i> <a href="Document/FichedeRenseignement.pdf" target="_blank" rel="noopener">Télécharger la fiche de renseignements obligatoire <strong>SDBB 2025-2026</strong></a> (à rendre lors des permanences d'inscription)</li>
                    <li><i class="fas fa-angle-right"></i> <a href="Document/CertificatMedicale2025-2026.pdf" target="_blank" rel="noopener">Télécharger le Certificat médical 2025-2026</a></li>
                    <li><i class="fas fa-angle-right"></i> <a href="Document/TableauSurclassement.pdf" target="_blank" rel="noopener">Télécharger le Tableau de surclassement de la FFBB</a></li>
                    <li><i class="fas fa-angle-right"></i> <a href="Document/Règlementinterieur.pdf" target="_blank" rel="noopener">Télécharger le Règlement intérieur</a> (à consulter)</li>
                    <li><i class="fas fa-angle-right"></i> <a href="Document/chartreduclub.pdf" target="_blank" rel="noopener">Télécharger la Charte du club</a> (à consulter)</li>
                    <li><i class="fas fa-angle-right"></i> <a href="Document/tarif.pdf" target="_blank" rel="noopener">Télécharger les Tarifs</a></li>
                </ul>

            </div>

            <br>"""

new_sec_4 = """            <details class="accordion animate-on-scroll mt-5" id="documents">
                <summary>
                    <div class="section-title text-center">
                        <h2>3 – Documents à télécharger</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="member-card delay-100" style="text-align: left; margin-top: 25px;">
                        <p class="mt-3">Télécharger la/les documents ci-dessous :</p>
                        <ul class="check-list mt-3">
                            <li><i class="fas fa-angle-right"></i> <a href="Document/FichedeRenseignement.pdf" target="_blank" rel="noopener">Télécharger la fiche de renseignements obligatoire <strong>SDBB 2025-2026</strong></a> (à rendre lors des permanences d'inscription)</li>
                            <li><i class="fas fa-angle-right"></i> <a href="Document/CertificatMedicale2025-2026.pdf" target="_blank" rel="noopener">Télécharger le Certificat médical 2025-2026</a></li>
                            <li><i class="fas fa-angle-right"></i> <a href="Document/TableauSurclassement.pdf" target="_blank" rel="noopener">Télécharger le Tableau de surclassement de la FFBB</a></li>
                            <li><i class="fas fa-angle-right"></i> <a href="Document/Règlementinterieur.pdf" target="_blank" rel="noopener">Télécharger le Règlement intérieur</a> (à consulter)</li>
                            <li><i class="fas fa-angle-right"></i> <a href="Document/chartreduclub.pdf" target="_blank" rel="noopener">Télécharger la Charte du club</a> (à consulter)</li>
                            <li><i class="fas fa-angle-right"></i> <a href="Document/tarif.pdf" target="_blank" rel="noopener">Télécharger les Tarifs</a></li>
                        </ul>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_4, new_sec_4)

# Section 4
old_sec_5 = """            <div class="section-title text-center animate-on-scroll mt-5" id="fiche-renseignements">
                <h2>4- Fiche de renseignements</h2>

                <div class="underline center"></div>
            </div>

            <div class="member-card animate-on-scroll delay-100" style="text-align: left; margin-top: 25px;">
                <ul class="check-list mt-3">
                    <li><i class="fas fa-angle-right"></i> A donner au secrétariat au début des entraînements de septembre</li>
                </ul>
            </div>
            <br>"""

new_sec_5 = """            <details class="accordion animate-on-scroll mt-5" id="fiche-renseignements">
                <summary>
                    <div class="section-title text-center">
                        <h2>4- Fiche de renseignements</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="member-card delay-100" style="text-align: left; margin-top: 25px;">
                        <ul class="check-list mt-3">
                            <li><i class="fas fa-angle-right"></i> A donner au secrétariat au début des entraînements de septembre</li>
                        </ul>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_5, new_sec_5)


# Section Aides
old_sec_6 = """            <div class="section-title text-center animate-on-scroll mt-5" id="aides">
                <h2>Aides pour la licence</h2>

                <div class="underline center"></div>
            </div>

            <div class="member-card animate-on-scroll delay-200" style="text-align: left; margin-top: 25px;">
                <ul class="check-list mt-3">
                    <li><i class="fas fa-money-bill-wave"></i> De 10 à 21 ans pour les résidents à St-Doulchard : <strong>Chèque Jeune de 36€</strong> à récupérer au Centre de Loisirs. Vous pouvez déduire directement ce montant sur votre cotisation (si vous le fournissez lors du règlement sinon il vous sera remboursé).</li>
                    <li><i class="fas fa-university"></i> Aide du Conseil Départemental, jusqu’à 16 ans : aide variable de <strong>25€</strong> et <strong>50€</strong> selon les situations (à faire vous-même en ligne).</li>
                    <li><i class="fas fa-gift"></i> <strong>Pass’Sport</strong> pour les 6-18 ans : 50€ (1 seule utilisation par enfant) grâce au courrier reçu dès juin 2025.</li>
                </ul>

                <p class="mt-3">Lien Pass’Sport : <a href="https://www.sports.gouv.fr/le-pass-sport-reconduit-pour-la-saison-2025-2026-295" target="_blank" rel="noopener">https://www.sports.gouv.fr/le-pass-sport-reconduit-pour-la-saison-2025-2026-295</a></p>
            </div>

            <div class="member-card animate-on-scroll delay-100" style="text-align: left; margin-top: 25px; border-left: 6px solid var(--primary-color);">
                <h3><i class="fas fa-triangle-exclamation" style="color:var(--primary-color);"></i> Rappel des conditions</h3>
                <ul class="check-list mt-3">
                    <li><i class="fas fa-angle-right"></i> AUCUN DOSSIER D'INSCRIPTION INCOMPLET NE SERA ACCEPTÉ</li>
                    <li><i class="fas fa-angle-right"></i> La licence n'est validée qu'après règlement intégral</li>
                    <li><i class="fas fa-angle-right"></i> Les documents sont à retourner à la secrétaire lors des permanences d'inscriptions au club house « La Tanière »</li>
                </ul>
            </div>"""

new_sec_6 = """            <details class="accordion animate-on-scroll mt-5" id="aides">
                <summary>
                    <div class="section-title text-center">
                        <h2>Aides pour la licence</h2>
                        <div class="underline center"></div>
                    </div>
                </summary>
                <div class="accordion-content">
                    <div class="member-card delay-200" style="text-align: left; margin-top: 25px;">
                        <ul class="check-list mt-3">
                            <li><i class="fas fa-money-bill-wave"></i> De 10 à 21 ans pour les résidents à St-Doulchard : <strong>Chèque Jeune de 36€</strong> à récupérer au Centre de Loisirs. Vous pouvez déduire directement ce montant sur votre cotisation (si vous le fournissez lors du règlement sinon il vous sera remboursé).</li>
                            <li><i class="fas fa-university"></i> Aide du Conseil Départemental, jusqu’à 16 ans : aide variable de <strong>25€</strong> et <strong>50€</strong> selon les situations (à faire vous-même en ligne).</li>
                            <li><i class="fas fa-gift"></i> <strong>Pass’Sport</strong> pour les 6-18 ans : 50€ (1 seule utilisation par enfant) grâce au courrier reçu dès juin 2025.</li>
                        </ul>

                        <p class="mt-3">Lien Pass’Sport : <a href="https://www.sports.gouv.fr/le-pass-sport-reconduit-pour-la-saison-2025-2026-295" target="_blank" rel="noopener">https://www.sports.gouv.fr/le-pass-sport-reconduit-pour-la-saison-2025-2026-295</a></p>
                    </div>

                    <div class="member-card delay-100" style="text-align: left; margin-top: 25px; border-left: 6px solid var(--primary-color);">
                        <h3><i class="fas fa-triangle-exclamation" style="color:var(--primary-color);"></i> Rappel des conditions</h3>
                        <ul class="check-list mt-3">
                            <li><i class="fas fa-angle-right"></i> AUCUN DOSSIER D'INSCRIPTION INCOMPLET NE SERA ACCEPTÉ</li>
                            <li><i class="fas fa-angle-right"></i> La licence n'est validée qu'après règlement intégral</li>
                            <li><i class="fas fa-angle-right"></i> Les documents sont à retourner à la secrétaire lors des permanences d'inscriptions au club house « La Tanière »</li>
                        </ul>
                    </div>
                </div>
            </details>"""

content = replace_section(content, old_sec_6, new_sec_6)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement complete. Let's test if everything replaced properly.")
if old_sec_1 in content: print("Warning: old_sec_1 not replaced")
if old_sec_2 in content: print("Warning: old_sec_2 not replaced")
if old_sec_3 in content: print("Warning: old_sec_3 not replaced")
if old_sec_4 in content: print("Warning: old_sec_4 not replaced")
if old_sec_5 in content: print("Warning: old_sec_5 not replaced")
if old_sec_6 in content: print("Warning: old_sec_6 not replaced")

