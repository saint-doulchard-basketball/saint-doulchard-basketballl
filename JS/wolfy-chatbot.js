document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.querySelector('[data-wolfy-chatbot]');
    if (!chatbot) return;

    const launcher = chatbot.querySelector('.wolfy-chatbot__launcher');
    const panel = chatbot.querySelector('.wolfy-chatbot__panel');
    const closeButton = chatbot.querySelector('.wolfy-chatbot__close');
    const messages = chatbot.querySelector('.wolfy-chatbot__messages');
    const form = chatbot.querySelector('.wolfy-chatbot__form');
    const input = chatbot.querySelector('#wolfy-chat-input');
    const suggestions = chatbot.querySelector('.wolfy-chatbot__suggestions');

    if (!launcher || !panel || !closeButton || !messages || !form || !input || !suggestions) return;

    const addMessage = (text, sender, link) => {
        const message = document.createElement('div');
        message.className = `wolfy-chatbot__message wolfy-chatbot__message--${sender}`;

        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        message.appendChild(paragraph);

        const links = Array.isArray(link) ? link : link ? [link] : [];
        links.forEach((item) => {
            const anchor = document.createElement('a');
            anchor.className = 'wolfy-chatbot__answer-link';
            anchor.href = item.href;
            anchor.textContent = item.label;
            if (item.target) {
                anchor.target = item.target;
                anchor.rel = 'noopener';
            }

            const icon = document.createElement('i');
            icon.className = 'fas fa-arrow-right';
            icon.setAttribute('aria-hidden', 'true');
            anchor.appendChild(icon);
            message.appendChild(anchor);
        });

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    };

    const normalize = (value) => value
        .toLocaleLowerCase('fr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[’']/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const stopWords = new Set([
        'alors', 'avec', 'avez', 'avoir', 'bonjour', 'bonsoir', 'ceci', 'cela', 'comment',
        'dans', 'de', 'des', 'donc', 'du', 'elle', 'elles', 'en', 'et', 'encore', 'est',
        'faire', 'fait', 'ici', 'ils', 'j ai', 'la', 'le', 'les', 'mais', 'merci', 'mon',
        'nous', 'notre', 'ou', 'par', 'pas', 'peux', 'peut', 'pour', 'pourquoi', 'quand',
        'que', 'quel', 'quelle', 'quelles', 'quels', 'qui', 'quoi', 'sa', 'salut', 'sans',
        'se', 'ses', 'son', 'sont', 'sur', 'ta', 'tes', 'toi', 'ton', 'tous', 'tout',
        'tres', 'une', 'vos', 'vous', 'votre', 'y a'
    ]);

    const getSearchTerms = (value) => normalize(value)
        .split(' ')
        .filter((word) => word.length > 1 && !stopWords.has(word))
        .map((word) => {
            if (word.length > 4 && /[sx]$/.test(word)) return word.slice(0, -1);
            if (word.length > 5 && /e$/.test(word)) return word.slice(0, -1);
            return word;
        });

    const getPageUrl = (value) => {
        const url = new URL(value, window.location.href);
        url.hash = '';
        url.search = '';
        if (url.pathname.endsWith('/')) url.pathname += 'index.html';
        return url;
    };

    const isLocalHtmlPage = (url, siteOrigin) => {
        if (url.origin !== siteOrigin) return false;
        if (url.pathname.endsWith('/')) return true;
        return url.pathname.toLowerCase().endsWith('.html');
    };

    const extractPage = (pageDocument, url) => {
        const title = pageDocument.querySelector('h1')?.textContent?.trim()
            || pageDocument.title
            || url.pathname;
        const content = pageDocument.body.cloneNode(true);

        content.querySelectorAll(
            'header, nav, footer, script, style, noscript, .wolfy-chatbot, .main-footer'
        ).forEach((element) => element.remove());

        const seenSegments = new Set();
        const segments = Array.from(content.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, li, td, summary, blockquote, a, .team-member'
        ))
            .map((element) => {
                const textElement = element.cloneNode(true);
                textElement.querySelectorAll('.team-contact').forEach((contact) => contact.remove());
                const text = textElement.textContent.replace(/\s+/g, ' ').trim();
                let href;
                if (element.tagName === 'A') {
                    try {
                        const rawHref = element.getAttribute('href');
                        if (rawHref) {
                            const linkUrl = new URL(rawHref, url.href);
                            if (['http:', 'https:'].includes(linkUrl.protocol)) {
                                href = linkUrl.href;
                            }
                        }
                    } catch (error) {
                        if (!(error instanceof TypeError)) throw error;
                    }
                }
                return { text, href };
            })
            .filter((segment) => {
                if (segment.text.length < 12 || seenSegments.has(segment.text)) return false;
                seenSegments.add(segment.text);
                return true;
            })
            .map((segment) => ({ ...segment, terms: new Set(getSearchTerms(segment.text)) }));

        return { title, href: url.href, segments };
    };

    const fetchPageDocument = async (url) => {
        const response = await fetch(url.href, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`La page ${url.pathname} a répondu avec le statut ${response.status}.`);
        }
        const html = await response.text();
        return new DOMParser().parseFromString(html, 'text/html');
    };

    const indexSitePages = async () => {
        const startUrl = getPageUrl(window.location.href);
        const pages = new Map();
        const visited = new Set([startUrl.href]);
        let failedPages = 0;

        pages.set(startUrl.href, extractPage(document, startUrl));

        if (!['http:', 'https:'].includes(startUrl.protocol)) {
            return { pages: Array.from(pages.values()), failedPages: 1 };
        }

        const queue = [];
        const enqueueLinks = (pageDocument, pageUrl) => {
            pageDocument.querySelectorAll('a[href]').forEach((anchor) => {
                try {
                    const href = anchor.getAttribute('href');
                    if (!href) return;
                    const url = getPageUrl(new URL(href, pageUrl.href).href);
                    if (!isLocalHtmlPage(url, startUrl.origin) || visited.has(url.href)) return;
                    visited.add(url.href);
                    queue.push(url);
                } catch (error) {
                    if (!(error instanceof TypeError)) throw error;
                }
            });
        };

        enqueueLinks(document, startUrl);

        while (queue.length > 0 && visited.size <= 100) {
            const batch = queue.splice(0, 5);
            await Promise.all(batch.map(async (url) => {
                try {
                    const pageDocument = await fetchPageDocument(url);
                    pages.set(url.href, extractPage(pageDocument, url));
                    enqueueLinks(pageDocument, url);
                } catch (error) {
                    failedPages += 1;
                    console.warn('Wolfy n’a pas pu lire une page du site.', error);
                }
            }));
        }

        return { pages: Array.from(pages.values()), failedPages };
    };

    let pageIndexPromise;
    const getPageIndex = () => {
        if (!pageIndexPromise) pageIndexPromise = indexSitePages();
        return pageIndexPromise;
    };
    let indexingWarningShown = false;

    const findPageAnswer = (question, indexedPages) => {
        const terms = Array.from(new Set(getSearchTerms(question)));
        if (terms.length === 0) return null;

        const documentFrequency = new Map(terms.map((term) => [term, 0]));
        indexedPages.forEach((page) => {
            const pageTerms = new Set(page.segments.flatMap((segment) => Array.from(segment.terms)));
            terms.forEach((term) => {
                if (pageTerms.has(term)) documentFrequency.set(term, documentFrequency.get(term) + 1);
            });
        });

        const weights = new Map(terms.map((term) => [
            term,
            1 + Math.log((indexedPages.length + 1) / (documentFrequency.get(term) + 1))
        ]));

        const rankedPages = indexedPages.map((page) => {
            const rankedSegments = page.segments
                .map((segment) => {
                    const matchedTerms = terms.filter((term) => segment.terms.has(term));
                    const score = matchedTerms.reduce((total, term) => total + weights.get(term), 0);
                    return { ...segment, score, matchedTerms };
                })
                .filter((segment) => segment.score > 0)
                .sort((a, b) => b.score - a.score);

            return {
                page,
                segments: rankedSegments,
                score: rankedSegments.slice(0, 3).reduce((total, segment) => total + segment.score, 0)
            };
        }).filter((result) => result.segments.length > 0)
            .sort((a, b) => b.score - a.score);

        const bestPage = rankedPages[0];
        if (!bestPage || bestPage.segments[0].score < 1.2) return null;

        const bestTerms = new Set(bestPage.segments[0].matchedTerms);
        const additionalSegment = bestPage.segments.find((segment) =>
            segment !== bestPage.segments[0]
            && segment.score >= 1.2
            && segment.matchedTerms.some((term) => !bestTerms.has(term))
        );
        const excerpt = [bestPage.segments[0].text, additionalSegment?.text]
            .filter(Boolean)
            .join(' ');
        const answerText = excerpt.length > 520
            ? `${excerpt.slice(0, 517).replace(/\s+\S*$/, '')}…`
            : excerpt;
        const bestSegment = bestPage.segments[0];
        const sourceHref = bestSegment.href || bestPage.page.href;
        const sourceLabel = bestSegment.href
            ? `Ouvrir : ${bestSegment.text.slice(0, 70)}`
            : `Lire la page : ${bestPage.page.title}`;

        return {
            text: answerText,
            link: { label: sourceLabel, href: sourceHref }
        };
    };

    const answers = [
        {
            matches: /\b(arbitrage|arbitrer|arbitre|arbitres|arbitral|arbitrale|arbitraux)\b/,
            text: 'Pour découvrir comment devenir arbitre et vous former, consultez la page de l’École d’arbitrage du club.',
            link: {
                label: 'Découvrir l’École d’arbitrage',
                href: 'https://arbitrage-sdbb.alwaysdata.net/',
                target: '_blank'
            }
        },
        {
            matches: /\b(contact|contacter|joindre|telephone|email|mail|adresse|responsable)\b/,
            text: 'Pour une question qui nécessite une réponse du club, vous pouvez écrire à l’équipe via le formulaire de contact.',
            link: { label: 'Contacter le club', href: 'contact.html' }
        },
        {
            matches: /\b(inscription|inscrire|inscris|licence|licencie|dossier|tarif|prix|cotisation|cout|aide financiere)\b/,
            text: 'Les étapes d’inscription, les documents à fournir et les informations sur les aides sont détaillés sur la page dédiée.',
            link: { label: 'Voir les inscriptions 2026-2027', href: 'inscription-2026-2027.html' }
        },
        {
            matches: /\b(horaire|horaires|entrainement|entrainements|creneau|creneaux|gymnase|salle)\b/,
            text: 'Les créneaux d’entraînement sont disponibles dans le document du club.',
            link: { label: 'Voir les créneaux d’entraînement', href: 'Document/Planning entrainement 2026 - 2027.pdf' }
        },
        {
            matches: /\b(match|matchs|planning|calendrier|resultat|resultats|rencontre)\b/,
            text: 'Retrouvez le planning des matchs et les rencontres des équipes sur cette page.',
            link: { label: 'Consulter le planning', href: 'planning.html' }
        },
        {
            matches: /\b(evenement|evenements|agenda|tournoi|stage|manifestation)\b/,
            text: 'Les événements et les temps forts de la vie du club sont regroupés dans l’agenda.',
            link: { label: 'Voir les événements', href: 'evenements.html' }
        },
        {
            matches: /\b(mini basket|micro basket|baby|enfant|enfants|petit|petite|u7|u9|u11)\b/,
            text: 'Le club accueille les enfants dès le Micro-Basket (3 à 5 ans). Découvrez l’école de mini-basket et ses informations pratiques.',
            link: { label: 'Découvrir le mini-basket', href: 'mini-basket.html' }
        },
        {
            matches: /\b(equipe|equipes|senior|seniors|feminine|masculine|joueur|joueuse)\b/,
            text: 'Le SDBB propose des équipes de jeunes et des équipes seniors. Retrouvez leur présentation sur la page des équipes.',
            link: { label: 'Découvrir les équipes', href: 'equipes.html' }
        },
        {
            matches: /\b(boutique|maillot|tenue|vetement|achat|acheter)\b/,
            text: 'La boutique du club rassemble les informations sur les équipements et articles aux couleurs du SDBB.',
            link: { label: 'Accéder à la boutique', href: 'boutique.html' }
        },
        {
            matches: /\b(partenaire|partenaires|sponsor|sponsoring|mecenat)\b/,
            text: 'Vous souhaitez découvrir ou rejoindre les partenaires du club ? Voici les pages dédiées.',
            link: { label: 'Découvrir les partenaires', href: 'partenaires.html' }
        },
        {
            matches: /\b(tonic|marche|loisir|loisirs|3\s*x\s*3|basket en marchant)\b/,
            text: 'Le club propose aussi des activités comme le SDBB Tonic et le basket en marchant.',
            link: { label: 'Découvrir ces activités', href: 'sdbb-tonic-marche.html' }
        },
        {
            matches: /\b(coach|entraineur|entraineuse|encadrement)\b/,
            text: 'La page des coachs présente l’encadrement sportif du club.',
            link: { label: 'Voir les coachs', href: 'coach.html' }
        },
        {
            matches: /\b(reglement|charte)\b/,
            text: 'Le règlement intérieur et les documents de référence du SDBB sont consultables sur le site.',
            link: { label: 'Consulter le règlement', href: 'reglement-sdbb.html' }
        },
        {
            matches: /\b(label|labels)\b/,
            text: 'Le SDBB présente ses labels et les engagements reconnus par la FFBB sur cette page.',
            link: { label: 'Voir les labels du club', href: 'labels.html' }
        },
        {
            matches: /\b(boite a idees|idee|idees)\b/,
            text: 'Vous pouvez transmettre vos idées au club depuis la boîte à idées.',
            link: { label: 'Ouvrir la boîte à idées', href: 'boite-a-idees.html' }
        },
        {
            matches: /\b(rejoindre|essai|essayer|debuter|commencer|jouer au basket|faire du basket|decouvrir le basket)\b/,
            text: 'Envie de rejoindre le SDBB ? Retrouvez les informations pour faire vos premiers pas au club.',
            link: { label: 'Nous rejoindre', href: 'rejoindre.html' }
        },
        {
            matches: /\b(club|presentation|histoire|association|bureau|conseil|projet)\b/,
            text: 'Pour en savoir plus sur le Saint Doulchard Basketball, consultez sa présentation et son projet club.',
            link: { label: 'Découvrir le club', href: 'presentation-sdbb.html' }
        }
    ];

    const findAnswer = (question) => {
        const normalizedQuestion = normalize(question);
        return answers.find((answer) => answer.matches.test(normalizedQuestion)) || null;
    };

    const answerStructuredQuestion = (question, indexedPages) => {
        const normalizedQuestion = normalize(question);
        const asksAboutSocialNetworks = /\b(reseaux? sociaux?|facebook|instagram|insta)\b/.test(normalizedQuestion);

        if (asksAboutSocialNetworks) {
            return {
                text: 'Le SDBB est présent sur Facebook et Instagram. Suivez-nous pour retrouver les actualités et la vie du club.',
                link: [
                    { label: 'Suivre le SDBB sur Facebook', href: 'https://www.facebook.com/sdbbofficiel/?locale=fr_FR', target: '_blank' },
                    { label: 'Suivre le SDBB sur Instagram', href: 'https://www.instagram.com/saintdoulchard_basketball/', target: '_blank' }
                ]
            };
        }

        const matchScheduleQuestion = /\b(match|matchs|rencontre|rencontres|calendrier)\b/.test(normalizedQuestion)
            && /\b(horaire|horaires|heure|heures|week|week end|samedi|dimanche|weekend)\b/.test(normalizedQuestion);

        if (matchScheduleQuestion) {
            return {
                text: 'Les horaires et le programme des matchs du week-end sont consultables dans le planning officiel. Vous pouvez filtrer par équipe et par week-end.',
                link: { label: 'Voir le planning des matchs', href: 'planning.html' }
            };
        }

        const asksAboutCoach = /\b(coach|coachs|entraineur|entraineurs|entraineuse|entraineuses|encadrant|encadrants)\b/.test(normalizedQuestion);
        if (!asksAboutCoach) return null;

        const categoryMatch = normalizedQuestion.match(/\bu\s?(\d{1,2})\s?([fm])?\b/);
        const coachesPage = indexedPages.find((page) => new URL(page.href).pathname.toLowerCase().endsWith('/coach.html'));

        if (categoryMatch) {
            const category = `u${categoryMatch[1]}${categoryMatch[2] || ''}`;
            const coachSegments = coachesPage?.segments.filter((segment) =>
                segment.text.replace(/\s+/g, '').toLowerCase().includes(category)
            ) || [];

            if (coachSegments.length > 0) {
                const coaches = Array.from(new Set(coachSegments.map((segment) => segment.text)));
                return {
                    text: `Pour la catégorie ${category.toUpperCase()}, ${coaches.join(' ; ')}.`,
                    link: { label: 'Voir tous les coachs', href: coachesPage.href }
                };
            }

            return {
                text: `Je n’ai pas trouvé le nom du coach de la catégorie ${category.toUpperCase()} dans la liste actuelle du site.`,
                link: { label: 'Consulter la liste des coachs', href: 'coach.html' }
            };
        }

        return {
            text: 'La liste des coachs et leurs catégories est disponible sur cette page.',
            link: { label: 'Voir les coachs du club', href: 'coach.html' }
        };
    };

    const isClubPresentationQuestion = (question) => {
        const normalizedQuestion = normalize(question);
        const mentionsClub = /\b(club|sdbb|saint doulchard|basket|basketball)\b/.test(normalizedQuestion);
        const asksForPresentation = /\b(presente|presentez|presentation|parle|parlez|raconte|racontez|decouvre|decouvrez|decouvrir)\b/.test(normalizedQuestion);
        const asksToIntroduceClub = /^(presente|presentez) moi (le )?(club|sdbb|saint doulchard|basket|basketball)$/.test(normalizedQuestion)
            || /^(fais|faites) moi decouvrir (le )?(club|sdbb|saint doulchard|basket|basketball)$/.test(normalizedQuestion)
            || /^qui sommes nous$/.test(normalizedQuestion);

        return asksToIntroduceClub
            || (asksForPresentation && mentionsClub)
            || /\b(a propos du club|histoire du club)\b/.test(normalizedQuestion);
    };

    const answerQuestion = async (question) => {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) return;

        addMessage(trimmedQuestion, 'user');
        const normalizedQuestion = normalize(trimmedQuestion);

        if (/^(bonjour|bonsoir|salut|coucou|hello|oui|oui j ai une question|j ai une question|une question)$/.test(normalizedQuestion)) {
            addMessage('Bien sûr ! Écrivez votre question ci-dessous ou choisissez un sujet parmi les suggestions.', 'bot');
            return;
        }

        if (/^(non|non merci|merci|merci wolfy)$/.test(normalizedQuestion)) {
            addMessage('Avec plaisir ! Je reste là si vous avez besoin d’une information sur le club.', 'bot');
            return;
        }

        if (isClubPresentationQuestion(trimmedQuestion)) {
            addMessage(
                'Le Saint-Doulchard Basket Ball (SDBB) est un club de basket de Saint-Doulchard, fondé en 1993. Le club accueille les joueuses et joueurs dans un esprit convivial, du Micro-Basket jusqu’aux Seniors.',
                'bot',
                { label: 'Découvrir le club — Qui sommes-nous ?', href: 'presentation-sdbb.html' }
            );
            return;
        }

        if (/\b(arbitrage|arbitrer|arbitre|arbitres|arbitral|arbitrale|arbitraux)\b/.test(normalizedQuestion)) {
            const arbitrationAnswer = answers.find((answer) =>
                answer.matches.test(normalizedQuestion)
            );
            if (arbitrationAnswer) {
                addMessage(arbitrationAnswer.text, 'bot', arbitrationAnswer.link);
                return;
            }
        }

        const searchStatus = addMessage('Je cherche dans les pages du site…', 'bot');
        const index = await getPageIndex();
        searchStatus.remove();

        const structuredAnswer = answerStructuredQuestion(trimmedQuestion, index.pages);
        if (structuredAnswer) {
            addMessage(structuredAnswer.text, 'bot', structuredAnswer.link);
            return;
        }

        if (index.failedPages > 0 && !indexingWarningShown) {
            indexingWarningShown = true;
            addMessage(
                index.pages.length > 1
                    ? 'Certaines pages n’ont pas pu être lues, mais je cherche dans les autres pages accessibles.'
                    : 'Le navigateur ne me permet pas de lire les autres pages depuis cette ouverture locale. Pour que je puisse les parcourir, ouvrez le site depuis son adresse web.',
                'bot'
            );
        }

        const pageAnswer = findPageAnswer(trimmedQuestion, index.pages);
        if (pageAnswer) {
            addMessage(pageAnswer.text, 'bot', pageAnswer.link);
            return;
        }

        const answer = findAnswer(trimmedQuestion);

        if (answer) {
            addMessage(answer.text, 'bot', answer.link);
            return;
        }

        addMessage(
            'Je n’ai pas trouvé cette information dans les pages du site que je connais. Le club pourra vous répondre directement via la page Contact.',
            'bot',
            { label: 'Contacter le club', href: 'contact.html' }
        );
    };

    addMessage(
        'Bonjour ! Je suis Wolfy, la mascotte du SDBB. Avez-vous une question ? Je cherche dans les pages du site pour vous répondre et vous indiquer ma source.',
        'bot'
    );

    launcher.addEventListener('click', () => {
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        getPageIndex();
        input.focus();
    });

    const closeChat = () => {
        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
        launcher.focus();
    };

    closeButton.addEventListener('click', closeChat);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) closeChat();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        answerQuestion(input.value);
        input.value = '';
        input.focus();
    });

    suggestions.addEventListener('click', (event) => {
        const button = event.target.closest('[data-wolfy-question]');
        if (!button) return;

        answerQuestion(button.dataset.wolfyQuestion || '');
        input.focus();
    });
});
