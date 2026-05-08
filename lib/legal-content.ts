import type { Locale } from "@/lib/i18n";

export type LegalSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPage = {
  title: string;
  intro?: string[];
  updated?: string;
  sections: LegalSection[];
};

// =====================================================================
// ABOUT — /sobre
// =====================================================================

const ABOUT: Record<Locale, LegalPage> = {
  en: {
    title: "About us",
    intro: [
      "We're truly passionate about the Algarve, the place we call home, and we want people to experience it the right way. This region has so much to offer, from unforgettable coastal views to relaxed days on the water and unique local experiences, and we're here to help visitors make the most of it.",
      "We're a small team with a big dream: to make holiday planning easier by helping people organize their time in the Algarve without the usual stress. We work to connect you with the right tours and experiences, give helpful recommendations, and take care of the details so everything feels simple and smooth.",
      "We're also here to answer any questions you might have about your bookings or any of the tours we offer, so you always feel supported along the way. Whether you're planning ahead or looking for something special once you arrive, we're here to help you enjoy your stay in a better, more efficient way.",
    ],
    sections: [],
  },
  "pt-PT": {
    title: "Sobre nós",
    intro: [
      "Temos uma verdadeira paixão pelo Algarve, o lugar que chamamos de casa, e queremos que as pessoas o vivam da maneira certa. Esta região tem tanto para oferecer — desde paisagens costeiras inesquecíveis a dias descontraídos na água e experiências locais únicas — e estamos aqui para ajudar os visitantes a aproveitarem ao máximo.",
      "Somos uma pequena equipa com um grande sonho: tornar o planeamento de férias mais fácil, ajudando as pessoas a organizar o seu tempo no Algarve sem o stress habitual. Trabalhamos para ligar-te aos passeios e experiências certas, dar recomendações úteis e tratar dos detalhes para que tudo seja simples e fluido.",
      "Estamos também aqui para responder a qualquer dúvida que tenhas sobre as tuas reservas ou os tours que oferecemos, para que te sintas sempre apoiado ao longo do caminho. Seja a planear com antecedência ou à procura de algo especial quando chegares, estamos aqui para te ajudar a desfrutar da tua estadia de forma melhor e mais eficiente.",
    ],
    sections: [],
  },
  "pt-BR": {
    title: "Sobre nós",
    intro: [
      "Temos uma paixão verdadeira pelo Algarve, o lugar que chamamos de casa, e queremos que as pessoas vivam a região da maneira certa. O Algarve tem muito a oferecer — de paisagens costeiras inesquecíveis a dias tranquilos na água e experiências locais únicas — e estamos aqui para ajudar você a aproveitar ao máximo.",
      "Somos uma equipe pequena com um grande sonho: facilitar o planejamento de férias, ajudando as pessoas a organizar o tempo no Algarve sem o estresse habitual. Trabalhamos para conectar você aos passeios e experiências certos, dar recomendações úteis e cuidar dos detalhes para que tudo flua de forma simples.",
      "Também estamos aqui para responder a qualquer dúvida sobre suas reservas ou os tours que oferecemos, para que você se sinta sempre apoiado. Seja para planejar com antecedência ou descobrir algo especial quando chegar, estamos aqui para você aproveitar sua viagem de um jeito melhor e mais eficiente.",
    ],
    sections: [],
  },
};

// =====================================================================
// PRIVACY — /privacidade
// =====================================================================

const PRIVACY: Record<Locale, LegalPage> = {
  "pt-PT": {
    title: "Política de Privacidade",
    updated: "Data da última atualização: 7 de maio de 2026",
    intro: [
      "A presente Política de Privacidade explica, de forma geral, como a Yourguidealgarve.com trata os dados pessoais recolhidos através do seu website, formulários de contacto, pedidos de informação, subscrição de newsletter e interações relacionadas com reservas, passeios e experiências turísticas.",
      "A proteção da privacidade dos utilizadores é levada a sério e o tratamento de dados pessoais é feito de forma limitada, adequada à finalidade e com respeito pelas regras aplicáveis em matéria de proteção de dados, incluindo o Regulamento (UE) 2016/679 (RGPD).",
    ],
    sections: [
      {
        heading: "1. Responsável pelo tratamento",
        paragraphs: [
          "O responsável pelo tratamento dos dados pessoais é a Yourguidealgarve.com.",
          "Para questões relacionadas com privacidade, utilização de dados ou exercício de direitos, o utilizador poderá recorrer aos contactos disponibilizados no website.",
        ],
      },
      {
        heading: "2. Dados que podem ser recolhidos",
        paragraphs: [
          "De modo geral, a navegação nas áreas públicas do website não exige o fornecimento de dados pessoais. No entanto, poderão ser recolhidos dados fornecidos voluntariamente pelo utilizador, nomeadamente:",
        ],
        bullets: [
          "Nome.",
          "Endereço de email.",
          "Número de telefone.",
          "Informações necessárias para responder a pedidos de contacto ou de reserva.",
          "Dados estritamente necessários para enviar informações relevantes sobre tours, reservas ou comunicações informativas, incluindo newsletters.",
        ],
      },
      {
        paragraphs: [
          "A Yourguidealgarve.com procura limitar a recolha ao mínimo necessário para cada finalidade e não solicita dados excessivos ou desnecessários no contexto normal de utilização do website.",
        ],
      },
      {
        heading: "3. Finalidades do tratamento",
        paragraphs: ["Os dados pessoais poderão ser utilizados, de forma geral, para as seguintes finalidades:"],
        bullets: [
          "Responder a pedidos de contacto, dúvidas ou solicitações enviadas pelo utilizador.",
          "Comunicar com o utilizador sobre tours, reservas, disponibilidade, alterações ou informações úteis relacionadas com os serviços solicitados.",
          "Enviar comunicações informativas ou promocionais, incluindo newsletters, quando exista base legítima para o efeito, nomeadamente consentimento quando exigido.",
          "Melhorar a organização do atendimento e assegurar o acompanhamento das interações com clientes e potenciais clientes.",
        ],
      },
      {
        heading: "4. Base legal para o tratamento",
        paragraphs: ["Consoante a situação, o tratamento dos dados poderá basear-se:"],
        bullets: [
          "No consentimento do titular dos dados, por exemplo para o envio de newsletters ou comunicações de marketing, quando aplicável.",
          "Na necessidade de efetuar diligências pré-contratuais ou de executar um serviço solicitado pelo utilizador, por exemplo para responder a pedidos relacionados com tours ou reservas.",
          "No interesse legítimo da Yourguidealgarve.com em gerir contactos, prestar apoio ao cliente e organizar a sua atividade, desde que não prevaleçam os direitos e liberdades do titular dos dados.",
        ],
      },
      {
        heading: "5. Partilha de dados",
        paragraphs: [
          "De forma geral, a Yourguidealgarve.com não vende, aluga nem partilha dados pessoais com websites de terceiros para fins comerciais próprios desses terceiros.",
          "Os dados tratados destinam-se essencialmente à gestão da relação com o utilizador e ao envio de informações relacionadas com os serviços e comunicações da própria Yourguidealgarve.com.",
          "Poderá, ainda assim, existir acesso limitado a dados por entidades que prestem serviços técnicos de alojamento, email, segurança, manutenção ou suporte ao website, sempre na medida do necessário ao funcionamento normal da atividade e sujeitos a deveres adequados de confidencialidade e segurança.",
          "Os dados poderão igualmente ser comunicados quando tal seja exigido por lei, por autoridade competente ou para defesa de direitos em procedimento administrativo, judicial ou equivalente.",
        ],
      },
      {
        heading: "6. Conservação dos dados",
        paragraphs: [
          "A Yourguidealgarve.com procura não conservar dados pessoais por mais tempo do que o necessário para as finalidades acima descritas. De forma geral:",
        ],
        bullets: [
          "Os dados de contacto ou pedidos de informação poderão ser mantidos durante o tempo razoavelmente necessário para responder ao utilizador e assegurar o respetivo acompanhamento.",
          "Os dados utilizados para comunicações informativas ou newsletters poderão ser mantidos até que o titular retire o consentimento, peça a remoção ou deixe de existir fundamento para a sua conservação.",
        ],
      },
      {
        paragraphs: [
          "Sempre que deixe de ser necessário conservar os dados, estes serão eliminados, anonimizados ou mantidos apenas na medida exigida por lei.",
        ],
      },
      {
        heading: "7. Segurança dos dados",
        paragraphs: [
          "A Yourguidealgarve.com adota medidas de segurança técnicas e organizativas normalmente adequadas para proteger os dados pessoais contra perda, uso indevido, acesso não autorizado, divulgação, alteração ou destruição.",
          "Embora nenhuma transmissão de dados pela internet ou sistema de armazenamento possa ser garantida como absolutamente inviolável, são aplicadas salvaguardas razoáveis e compatíveis com a natureza da atividade e com os meios normalmente utilizados neste tipo de website.",
        ],
      },
      {
        heading: "8. Direitos dos titulares dos dados",
        paragraphs: ["Nos termos da legislação aplicável, o titular dos dados poderá, consoante o caso, exercer os seguintes direitos:"],
        bullets: [
          "Direito de acesso.",
          "Direito de retificação.",
          "Direito ao apagamento.",
          "Direito à limitação do tratamento.",
          "Direito de oposição.",
          "Direito à portabilidade, quando aplicável.",
          "Direito de retirar o consentimento, sem comprometer a licitude do tratamento efetuado até essa data.",
        ],
      },
      {
        paragraphs: [
          "Para exercer estes direitos, o utilizador poderá utilizar os contactos disponibilizados no website.",
          "O titular dos dados poderá ainda apresentar reclamação junto da autoridade de controlo competente, nomeadamente a Comissão Nacional de Proteção de Dados (CNPD), se considerar que o tratamento dos seus dados viola a legislação aplicável.",
        ],
      },
      {
        heading: "9. Newsletters e comunicações",
        paragraphs: [
          "Sempre que o utilizador subscreva a newsletter ou aceite receber comunicações, a Yourguidealgarve.com poderá enviar conteúdos relacionados com tours, experiências, novidades, sugestões e outras informações que possam ser consideradas relevantes para quem pretende visitar ou organizar atividades no Algarve.",
          "O utilizador poderá deixar de receber estas comunicações a qualquer momento, através do mecanismo de cancelamento disponível na própria mensagem ou por contacto direto através dos meios disponibilizados no website.",
        ],
      },
      {
        heading: "10. Links externos",
        paragraphs: [
          "O website poderá conter ligações para websites ou plataformas de terceiros. A presente Política de Privacidade aplica-se apenas ao website da Yourguidealgarve.com e não abrange as práticas de privacidade de entidades externas.",
          "Sempre que o utilizador aceda a um website terceiro, deverá consultar a respetiva política de privacidade antes de fornecer quaisquer dados pessoais.",
        ],
      },
      {
        heading: "11. Menores",
        paragraphs: [
          "O website e os respetivos serviços não se destinam, de forma autónoma, a menores que não disponham de autorização dos pais ou representantes legais, nos casos em que tal seja legalmente exigido.",
        ],
      },
      {
        heading: "12. Alterações a esta política",
        paragraphs: [
          "A Yourguidealgarve.com poderá alterar ou atualizar a presente Política de Privacidade a qualquer momento, nomeadamente para refletir alterações legais, técnicas ou operacionais. A versão em vigor será a que se encontrar publicada no website na respetiva data.",
        ],
      },
      {
        heading: "13. Contactos",
        paragraphs: [
          "Para qualquer questão relacionada com esta Política de Privacidade ou com o tratamento de dados pessoais, o utilizador poderá utilizar os contactos disponibilizados no website da Yourguidealgarve.com.",
        ],
      },
    ],
  },
  "pt-BR": {
    title: "Política de Privacidade",
    updated: "Última atualização: 7 de maio de 2026",
    intro: [
      "Esta Política de Privacidade explica, de forma geral, como a Yourguidealgarve.com trata os dados pessoais coletados pelo site, formulários de contato, pedidos de informação, inscrição na newsletter e interações relacionadas com reservas, passeios e experiências turísticas.",
      "A proteção da privacidade dos usuários é levada a sério, e o tratamento dos dados é feito de forma limitada, adequada à finalidade e respeitando as regras aplicáveis em proteção de dados, incluindo o Regulamento (UE) 2016/679 (RGPD).",
    ],
    sections: [
      {
        heading: "1. Responsável pelo tratamento",
        paragraphs: [
          "O responsável pelo tratamento dos dados pessoais é a Yourguidealgarve.com.",
          "Para questões relacionadas com privacidade, uso de dados ou exercício de direitos, o usuário pode usar os contatos disponibilizados no site.",
        ],
      },
      {
        heading: "2. Dados que podem ser coletados",
        paragraphs: [
          "Em geral, a navegação nas áreas públicas do site não exige o fornecimento de dados pessoais. Poderão ser coletados, no entanto, dados fornecidos voluntariamente pelo usuário, como:",
        ],
        bullets: [
          "Nome.",
          "Endereço de e-mail.",
          "Número de telefone.",
          "Informações necessárias para responder a pedidos de contato ou reserva.",
          "Dados estritamente necessários para enviar informações relevantes sobre tours, reservas ou comunicações informativas, incluindo newsletters.",
        ],
      },
      {
        paragraphs: [
          "A Yourguidealgarve.com busca limitar a coleta ao mínimo necessário para cada finalidade e não solicita dados excessivos ou desnecessários no uso normal do site.",
        ],
      },
      {
        heading: "3. Finalidades do tratamento",
        paragraphs: ["Os dados pessoais podem ser usados, em geral, para:"],
        bullets: [
          "Responder a pedidos de contato, dúvidas ou solicitações enviadas pelo usuário.",
          "Comunicar com o usuário sobre tours, reservas, disponibilidade, alterações ou informações úteis dos serviços solicitados.",
          "Enviar comunicações informativas ou promocionais, incluindo newsletters, quando houver base legítima — em especial consentimento, quando exigido.",
          "Aprimorar a organização do atendimento e o acompanhamento das interações com clientes e potenciais clientes.",
        ],
      },
      {
        heading: "4. Base legal para o tratamento",
        paragraphs: ["Conforme o caso, o tratamento dos dados pode se basear:"],
        bullets: [
          "No consentimento do titular, por exemplo para envio de newsletters ou marketing, quando aplicável.",
          "Na necessidade de diligências pré-contratuais ou de execução de um serviço solicitado pelo usuário, como responder a pedidos relacionados a tours ou reservas.",
          "No interesse legítimo da Yourguidealgarve.com em gerir contatos, prestar suporte e organizar sua atividade, desde que não prevaleçam direitos e liberdades do titular.",
        ],
      },
      {
        heading: "5. Compartilhamento de dados",
        paragraphs: [
          "A Yourguidealgarve.com não vende, aluga nem compartilha dados pessoais com sites de terceiros para fins comerciais próprios desses terceiros.",
          "Os dados tratados se destinam essencialmente à gestão da relação com o usuário e ao envio de informações relacionadas aos serviços e comunicações da própria Yourguidealgarve.com.",
          "Pode haver acesso limitado a dados por entidades que prestam serviços técnicos de hospedagem, e-mail, segurança, manutenção ou suporte ao site, sempre no necessário e sob deveres adequados de confidencialidade.",
          "Os dados também podem ser comunicados quando exigido por lei, por autoridade competente ou para defesa de direitos em processo administrativo ou judicial.",
        ],
      },
      {
        heading: "6. Conservação dos dados",
        paragraphs: [
          "A Yourguidealgarve.com não conserva dados pessoais por mais tempo do que o necessário às finalidades. Em regra:",
        ],
        bullets: [
          "Dados de contato ou pedidos de informação podem ser mantidos pelo tempo razoavelmente necessário para responder e dar acompanhamento.",
          "Dados de comunicações informativas ou newsletters podem ser mantidos até que o titular retire o consentimento ou solicite a remoção.",
        ],
      },
      {
        paragraphs: [
          "Quando deixa de ser necessário conservar os dados, estes são eliminados, anonimizados ou mantidos apenas na medida exigida por lei.",
        ],
      },
      {
        heading: "7. Segurança dos dados",
        paragraphs: [
          "A Yourguidealgarve.com adota medidas técnicas e organizativas adequadas para proteger os dados pessoais contra perda, uso indevido, acesso não autorizado, divulgação, alteração ou destruição.",
          "Nenhuma transmissão pela internet é absolutamente inviolável, mas são aplicadas salvaguardas razoáveis e compatíveis com a natureza da atividade.",
        ],
      },
      {
        heading: "8. Direitos do titular dos dados",
        paragraphs: ["Conforme a lei aplicável, o titular pode exercer os seguintes direitos:"],
        bullets: [
          "Direito de acesso.",
          "Direito de retificação.",
          "Direito ao apagamento.",
          "Direito à limitação do tratamento.",
          "Direito de oposição.",
          "Direito à portabilidade, quando aplicável.",
          "Direito de retirar o consentimento, sem prejudicar a licitude do tratamento já realizado.",
        ],
      },
      {
        paragraphs: [
          "Para exercer esses direitos, o usuário pode usar os contatos disponíveis no site. O titular também pode apresentar reclamação à autoridade de controle competente (em Portugal, a CNPD) se entender que o tratamento dos seus dados viola a legislação.",
        ],
      },
      {
        heading: "9. Newsletters e comunicações",
        paragraphs: [
          "Quando o usuário se inscreve na newsletter ou aceita receber comunicações, a Yourguidealgarve.com pode enviar conteúdos sobre tours, experiências, novidades e dicas para quem pretende visitar o Algarve.",
          "O usuário pode deixar de receber essas comunicações a qualquer momento, pelo link de cancelamento da própria mensagem ou pelos canais de contato do site.",
        ],
      },
      {
        heading: "10. Links externos",
        paragraphs: [
          "O site pode conter links para sites ou plataformas de terceiros. Esta Política aplica-se apenas ao site da Yourguidealgarve.com e não cobre práticas de privacidade de entidades externas.",
          "Antes de fornecer dados a um site terceiro, consulte a respectiva política de privacidade.",
        ],
      },
      {
        heading: "11. Menores",
        paragraphs: [
          "O site e os serviços não se destinam, de forma autônoma, a menores sem autorização dos pais ou representantes legais, nos casos legalmente exigidos.",
        ],
      },
      {
        heading: "12. Alterações a esta política",
        paragraphs: [
          "A Yourguidealgarve.com pode alterar ou atualizar esta Política de Privacidade a qualquer momento. A versão em vigor é a publicada no site naquela data.",
        ],
      },
      {
        heading: "13. Contato",
        paragraphs: [
          "Para qualquer questão sobre esta Política ou sobre o tratamento de dados, use os contatos disponibilizados no site da Yourguidealgarve.com.",
        ],
      },
    ],
  },
  "en": {
    title: "Privacy Policy",
    updated: "Last updated: May 7, 2026",
    intro: [
      "This Privacy Policy explains, in general terms, how Yourguidealgarve.com handles personal data collected through its website, contact forms, information requests, newsletter subscriptions, and interactions related to bookings, tours, and tourism experiences.",
      "Protecting users' privacy is taken seriously. Personal data is processed in a limited way, in line with the purpose for which it was collected, and in compliance with applicable data-protection rules, including Regulation (EU) 2016/679 (GDPR).",
    ],
    sections: [
      {
        heading: "1. Data controller",
        paragraphs: [
          "The controller of personal data is Yourguidealgarve.com.",
          "For privacy questions, data use, or to exercise your rights, you may use the contact details made available on the website.",
        ],
      },
      {
        heading: "2. Data we may collect",
        paragraphs: [
          "Browsing the public areas of the website generally does not require any personal data. We may, however, collect data you voluntarily provide, including:",
        ],
        bullets: [
          "Name.",
          "Email address.",
          "Phone number.",
          "Information needed to respond to contact or booking requests.",
          "Data strictly necessary to send you relevant information about tours, bookings, or informational communications, including newsletters.",
        ],
      },
      {
        paragraphs: [
          "Yourguidealgarve.com tries to limit data collection to what is necessary for each purpose and does not request excessive or unnecessary data in normal use of the website.",
        ],
      },
      {
        heading: "3. Purposes of processing",
        paragraphs: ["Personal data may be used, in general, for the following purposes:"],
        bullets: [
          "Responding to contact requests, questions, or requests submitted by the user.",
          "Communicating with the user about tours, bookings, availability, changes, or useful information related to the services requested.",
          "Sending informational or promotional communications, including newsletters, when there is a legitimate basis to do so — in particular consent, when required.",
          "Improving customer support and the follow-up of interactions with current and prospective customers.",
        ],
      },
      {
        heading: "4. Legal basis for processing",
        paragraphs: ["Depending on the situation, processing may be based on:"],
        bullets: [
          "The data subject's consent, for example for newsletters or marketing communications, where applicable.",
          "The need to take pre-contractual steps or perform a service requested by the user, such as responding to requests about tours or bookings.",
          "The legitimate interest of Yourguidealgarve.com in managing contacts, providing customer support, and organizing its activity, provided the rights and freedoms of the data subject do not prevail.",
        ],
      },
      {
        heading: "5. Data sharing",
        paragraphs: [
          "Yourguidealgarve.com does not sell, rent, or share personal data with third-party websites for those third parties' own commercial purposes.",
          "Data is mainly used to manage the relationship with the user and to send information related to Yourguidealgarve.com's own services and communications.",
          "Limited access to data may exist for entities providing technical services such as hosting, email, security, maintenance, or website support, always to the extent necessary and subject to appropriate confidentiality and security duties.",
          "Data may also be disclosed where required by law, by a competent authority, or for the defense of rights in administrative, judicial, or equivalent proceedings.",
        ],
      },
      {
        heading: "6. Data retention",
        paragraphs: [
          "Yourguidealgarve.com does not keep personal data for longer than necessary for the purposes described above. Generally:",
        ],
        bullets: [
          "Contact data or information requests may be kept for a reasonable time needed to respond and follow up.",
          "Data used for informational communications or newsletters may be kept until the subject withdraws consent or asks for removal.",
        ],
      },
      {
        paragraphs: [
          "When data no longer needs to be kept, it is deleted, anonymized, or retained only to the extent required by law.",
        ],
      },
      {
        heading: "7. Data security",
        paragraphs: [
          "Yourguidealgarve.com applies technical and organizational security measures appropriate to protect personal data against loss, misuse, unauthorized access, disclosure, alteration, or destruction.",
          "While no transmission over the internet can be guaranteed absolutely safe, reasonable safeguards consistent with the nature of the activity are applied.",
        ],
      },
      {
        heading: "8. Rights of data subjects",
        paragraphs: ["Under applicable law, the data subject may, where applicable, exercise the following rights:"],
        bullets: [
          "Right of access.",
          "Right to rectification.",
          "Right to erasure.",
          "Right to restriction of processing.",
          "Right to object.",
          "Right to data portability, where applicable.",
          "Right to withdraw consent, without affecting the lawfulness of processing carried out before withdrawal.",
        ],
      },
      {
        paragraphs: [
          "To exercise these rights, please use the contact details on the website. The data subject may also lodge a complaint with the competent supervisory authority (in Portugal, the CNPD) if they believe the processing of their data violates the applicable legislation.",
        ],
      },
      {
        heading: "9. Newsletters and communications",
        paragraphs: [
          "When the user subscribes to the newsletter or accepts to receive communications, Yourguidealgarve.com may send content related to tours, experiences, news, suggestions, and other information relevant to those visiting or planning activities in the Algarve.",
          "The user may unsubscribe at any time, through the unsubscribe link in the message itself or by contacting us via the channels available on the website.",
        ],
      },
      {
        heading: "10. External links",
        paragraphs: [
          "The website may contain links to third-party websites or platforms. This Privacy Policy applies only to Yourguidealgarve.com and does not cover the privacy practices of external entities.",
          "Whenever you access a third-party website, please review its own privacy policy before providing any personal data.",
        ],
      },
      {
        heading: "11. Minors",
        paragraphs: [
          "The website and its services are not intended, on their own, for minors who do not have authorization from parents or legal representatives, in cases where such authorization is legally required.",
        ],
      },
      {
        heading: "12. Changes to this policy",
        paragraphs: [
          "Yourguidealgarve.com may change or update this Privacy Policy at any time. The version in force is the one published on the website on the relevant date.",
        ],
      },
      {
        heading: "13. Contact",
        paragraphs: [
          "For any question related to this Privacy Policy or the processing of personal data, please use the contact details available on the Yourguidealgarve.com website.",
        ],
      },
    ],
  },
};

// =====================================================================
// TERMS — /termos
// =====================================================================

const TERMS: Record<Locale, LegalPage> = {
  "en": {
    title: "Terms and Conditions of Use",
    updated: "Last updated: May 7, 2026",
    sections: [
      {
        heading: "1. Scope and acceptance",
        paragraphs: [
          "These Terms and Conditions govern access to, browsing of, and use of the Yourguidealgarve.com website, as well as the use of its content, contact forms, communication channels, and any booking, tourism, or intermediation services made available online.",
          "By accessing or using this website, the user confirms that they have read, understood, and accepted these Terms and Conditions. If the user does not agree with them, they must refrain from using the website and its services.",
        ],
      },
      {
        heading: "2. Company identification",
        paragraphs: [
          "This website is operated by Yourguidealgarve.com.",
          "Whenever necessary, communications relating to the use of the website, information requests, bookings, or legal matters may be made through the contact details made available on the website.",
        ],
      },
      {
        heading: "3. Purpose of the website and services",
        paragraphs: [
          "Yourguidealgarve.com provides, through this website, information and access to tourism-related services in the Algarve, including, but not limited to, tours, experiences, guided visits, leisure activities, transfers, tailor-made proposals, and informational content about destinations and activities.",
          "The information displayed on the website is provided for informational and commercial purposes. The specific conditions applicable to each service — namely price, duration, meeting point, requirements, third-party involvement, cancellation rules, and availability — will be shown on the relevant product page, commercial offer, or booking flow.",
        ],
      },
      {
        heading: "4. Conditions of use",
        paragraphs: [
          "The user agrees to use the website lawfully, responsibly, and appropriately, and must refrain from any conduct that may harm the rights of Yourguidealgarve.com, other users, or third parties.",
          "In particular, the following are prohibited:",
        ],
        bullets: [
          "Using the website for unlawful, fraudulent, or bad-faith purposes.",
          "Uploading or transmitting viruses, malware, or any other technologically harmful material.",
          "Attempting to gain unauthorized access to restricted areas, systems, servers, or databases.",
          "Copying, reproducing, extracting, republishing, or commercially exploiting website content without prior written authorization.",
          "Using automated tools, scraping methods, or similar data collection techniques without express authorization.",
        ],
      },
      {
        heading: "5. Bookings and contracting",
        paragraphs: [
          "Bookings may be made through the website, via forms, through direct contact, or by means of integrated or partner booking platforms, depending on the type of service offered.",
          "Submitting a booking request does not, by itself, guarantee confirmation of the service. A booking is only considered final after express confirmation by Yourguidealgarve.com or by the partner operator responsible for the activity, and may depend on availability, validation of the information provided, and, where applicable, full or partial payment of the corresponding amount.",
          "Yourguidealgarve.com may act as the organizer, reseller, or intermediary of tourism services, depending on the nature of the experience displayed on the website. Where a specific service is provided by a third-party partner, that supplier's own terms may also apply and should be reviewed before the booking is completed.",
        ],
      },
      {
        heading: "6. Prices and payments",
        paragraphs: [
          "Unless otherwise stated, prices shown on the website are in euros and include VAT at the legal rate in force.",
          "Payments may be made using the methods available at the time of booking. Acceptance of a specific payment method depends on the technical solution adopted by the website or the partner booking platform.",
          "Yourguidealgarve.com reserves the right to change prices, correct obvious errors, update promotional campaigns, or withdraw commercial offers at any time, without affecting bookings that have already been confirmed.",
        ],
      },
      {
        heading: "7. Cancellations, changes, and no-shows",
        paragraphs: [
          "Each activity may be subject to its own cancellation, amendment, or rescheduling rules, which will be indicated during the booking process or in the service description.",
          "Where a cancellation request is submitted within the applicable deadline, the customer may be entitled to a full or partial refund according to the conditions specifically communicated for the booked service. After that deadline, or in case of failure to attend at the agreed place, date, and time, no refund may be due.",
          "Yourguidealgarve.com or the partner operator may change, suspend, or cancel activities due to force majeure, safety reasons, adverse weather conditions, operational restrictions, instructions from competent authorities, or other circumstances beyond reasonable control. In such cases, an alternative, rescheduling, or other appropriate solution may be offered whenever possible.",
        ],
      },
      {
        heading: "8. Right of withdrawal",
        paragraphs: [
          "For distance contracts, consumers may benefit from the statutory right of withdrawal where applicable under Portuguese law.",
          "However, this right may not apply in cases involving leisure, tourism, or activity services provided on a specific date or within a specific period, or where the service has been fully performed with the consumer's prior consent, as permitted by applicable law.",
        ],
      },
      {
        heading: "9. Customer responsibilities",
        paragraphs: [
          "The customer is responsible for providing correct, complete, and up-to-date information at the time of booking and for carefully checking all details contained in the booking confirmation.",
          "The customer must also:",
        ],
        bullets: [
          "Arrive on time at the designated meeting point.",
          "Ensure that they meet the physical, documentary, and age-related requirements for participation.",
          "Follow all safety instructions given by the Yourguidealgarve.com team or the partner operator.",
          "Inform in advance of any mobility limitations, relevant medical conditions, allergies, or special needs that may affect the provision of the service.",
        ],
      },
      {
        paragraphs: [
          "Failure to provide relevant information may compromise the provision of the service, without liability arising for Your Guide Algarve where such impossibility is not attributable to it.",
        ],
      },
      {
        heading: "10. Intellectual property",
        paragraphs: [
          "All content available on the website, including texts, descriptions, photographs, images, videos, graphics, trademarks, logos, visual elements, structure, organization, databases, and software, is protected by intellectual property rights and belongs to Yourguidealgarve.com or to third parties who have authorized its use.",
          "No content may be reproduced, distributed, adapted, made available to the public, stored, or used for commercial purposes without the prior written authorization of the respective rights holder.",
        ],
      },
      {
        heading: "11. Links to third-party websites",
        paragraphs: [
          "The website may contain links to third-party websites, booking platforms, social media channels, or partner operator pages. These links are provided for convenience only and do not imply approval, control, or guarantee regarding their content, services, or practices.",
          "Yourguidealgarve.com is not responsible for the operation, availability, legality, accuracy of content, or data processing carried out by third parties, and users are advised to read the relevant terms and policies before using those services.",
        ],
      },
      {
        heading: "12. Limitation of liability",
        paragraphs: [
          "Yourguidealgarve.com makes reasonable efforts to keep the information on the website accurate and up to date. However, it does not guarantee that the website will always be available or free from errors, interruptions, technical failures, or omissions.",
          "To the fullest extent permitted by law, Yourguidealgarve.com shall not be liable for indirect damages, loss of profits, loss of opportunity, communication failures, temporary website unavailability, viruses, external interference, or events beyond its reasonable control.",
          "Yourguidealgarve.com shall also not be liable for changes to, or constraints affecting, activities caused by weather, traffic, accidents, strikes, closures, administrative decisions, or limitations imposed by third-party service providers.",
        ],
      },
      {
        heading: "13. Personal data protection",
        paragraphs: [
          "Any personal data processed in connection with the use of the website and the booking of services will be handled in accordance with the Privacy Policy and, where applicable, the Cookies Policy, which should be read together with these Terms and Conditions.",
        ],
      },
      {
        heading: "14. Changes to these terms",
        paragraphs: [
          "Yourguidealgarve.com may review, amend, or update these Terms and Conditions at any time. Any changes will take effect from the date of publication on the website, unless otherwise required by law.",
          "Users are advised to consult this page regularly in order to remain informed of the current version.",
        ],
      },
      {
        heading: "15. Governing law and dispute resolution",
        paragraphs: [
          "These Terms and Conditions are governed by Portuguese law.",
          "In the event of a dispute, and without prejudice to any mandatory consumer protection rules that may apply, jurisdiction shall lie with the court determined by law in Portugal. Consumers may also have access, where applicable, to alternative consumer dispute resolution mechanisms under the applicable legislation.",
        ],
      },
      {
        heading: "16. Contact",
        paragraphs: [
          "For any questions relating to these Terms and Conditions or to the use of the website, users may contact Yourguidealgarve.com through the contact details made available on the website.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Termos e Condições de Utilização",
    updated: "Data da última atualização: 7 de maio de 2026",
    sections: [
      {
        heading: "1. Enquadramento e aceitação",
        paragraphs: [
          "Os presentes Termos e Condições regulam o acesso, navegação e utilização do website da Yourguidealgarve.com, bem como a utilização dos seus conteúdos, formulários, canais de contacto e eventuais serviços de reserva ou intermediação turística disponibilizados online.",
          "Ao aceder ao website, o utilizador declara ter lido, compreendido e aceite estes Termos e Condições. Caso não concorde com o seu conteúdo, deverá abster-se de utilizar o website e os respetivos serviços.",
        ],
      },
      {
        heading: "2. Identificação da entidade",
        paragraphs: [
          "O website é explorado pela Yourguidealgarve.com.",
          "Sempre que necessário, as comunicações relacionadas com a utilização do website, pedidos de informação, reservas ou questões legais poderão ser efetuadas através dos contactos disponibilizados no próprio website.",
        ],
      },
      {
        heading: "3. Finalidade do website e serviços",
        paragraphs: [
          "A Your Guide Algarve disponibiliza, através do website, informação e acesso a serviços relacionados com turismo no Algarve, incluindo, entre outros, passeios, experiências, visitas guiadas, atividades de lazer, transfers, propostas personalizadas e conteúdos informativos sobre destinos e atividades.",
          "A informação apresentada no website tem caráter informativo e comercial. As condições específicas de cada serviço, nomeadamente preço, duração, ponto de encontro, requisitos, inclusão de terceiros, política de cancelamento e disponibilidade, serão apresentadas na respetiva página de produto, proposta comercial ou fluxo de reserva.",
        ],
      },
      {
        heading: "4. Condições de acesso e utilização",
        paragraphs: [
          "O utilizador compromete-se a fazer uma utilização lícita, responsável e adequada do website, abstendo-se de praticar atos que possam prejudicar os direitos da Your Guide Algarve, de outros utilizadores ou de terceiros.",
          "É proibido, designadamente:",
        ],
        bullets: [
          "Utilizar o website para fins ilegais, fraudulentos ou contrários à boa-fé.",
          "Introduzir vírus, malware ou quaisquer outros elementos tecnologicamente nocivos.",
          "Tentar aceder sem autorização a áreas reservadas, sistemas, servidores ou bases de dados.",
          "Copiar, reproduzir, extrair, republicar ou explorar comercialmente conteúdos do website sem autorização prévia e por escrito.",
          "Utilizar mecanismos automáticos de recolha de dados, scraping ou ferramentas equivalentes sem autorização expressa.",
        ],
      },
      {
        heading: "5. Reservas e contratação",
        paragraphs: [
          "As reservas poderão ser efetuadas através do website, por formulário, por contacto direto ou por plataformas de reserva integradas ou parceiras, consoante o tipo de serviço disponibilizado.",
          "A submissão de um pedido de reserva não garante, por si só, a confirmação do serviço. A reserva apenas se considera concluída após confirmação expressa da Your Guide Algarve ou do parceiro responsável pela operação, podendo essa confirmação depender de disponibilidade, validação de dados e, quando aplicável, do pagamento total ou parcial do valor devido.",
          "A Yourguidealgarve.com poderá atuar como entidade organizadora, revendedora ou intermediária de serviços turísticos, consoante a natureza da experiência divulgada no website. Sempre que determinado serviço seja prestado por parceiro terceiro, poderão também aplicar-se as condições próprias desse fornecedor, as quais devem ser lidas antes da conclusão da reserva.",
        ],
      },
      {
        heading: "6. Preços e pagamentos",
        paragraphs: [
          "Salvo indicação em contrário, os preços apresentados no website são expressos em euros e incluem IVA à taxa legal em vigor.",
          "Os pagamentos poderão ser efetuados através dos meios que estiverem disponíveis no momento da reserva. A aceitação de um método de pagamento específico depende da solução técnica adotada no website ou na plataforma de reservas parceira.",
          "A Yourguidealgarve.com reserva-se o direito de alterar preços, corrigir erros manifestos, atualizar campanhas ou retirar ofertas comerciais a qualquer momento, sem prejuízo das reservas já confirmadas.",
        ],
      },
      {
        heading: "7. Cancelamentos, alterações e não comparência",
        paragraphs: [
          "Cada atividade pode estar sujeita a regras próprias de cancelamento, alteração ou reagendamento, as quais serão indicadas no momento da reserva ou na descrição do serviço.",
          "Quando o cancelamento seja pedido dentro do prazo aplicável, o cliente terá direito ao reembolso total ou parcial nos termos especificamente comunicados para o serviço reservado. Fora desse prazo, ou em caso de não comparência no local, data e hora definidos, poderá não existir lugar a reembolso.",
          "A Yourguidealgarve.com ou o operador parceiro poderá alterar, suspender ou cancelar atividades por motivos de força maior, razões de segurança, condições meteorológicas adversas, restrições operacionais, determinação de autoridades competentes ou outras circunstâncias alheias ao seu controlo razoável. Nesses casos, será proposta, quando possível, alternativa, reagendamento ou solução adequada ao caso concreto.",
        ],
      },
      {
        heading: "8. Direito de livre resolução",
        paragraphs: [
          "Nos contratos celebrados à distância, o consumidor poderá beneficiar do direito de livre resolução nos termos legalmente aplicáveis em Portugal.",
          "Contudo, esse direito poderá não se aplicar quando estejam em causa serviços de lazer, turismo ou atividades com data ou período de execução específico, ou quando o serviço tenha sido integralmente prestado com o consentimento prévio do consumidor, nos termos permitidos pela legislação em vigor.",
        ],
      },
      {
        heading: "9. Obrigações do cliente",
        paragraphs: [
          "O cliente é responsável por fornecer informações corretas, completas e atualizadas no momento da reserva e por verificar cuidadosamente todos os detalhes constantes da confirmação recebida.",
          "Compete igualmente ao cliente:",
        ],
        bullets: [
          "Comparecer atempadamente no ponto de encontro indicado.",
          "Garantir que reúne as condições físicas, documentais e etárias necessárias para participar na atividade.",
          "Respeitar as instruções de segurança transmitidas pela equipa da Yourguidealgarve.com ou pelo operador parceiro.",
          "Informar previamente sobre limitações de mobilidade, condições médicas relevantes, alergias ou necessidades especiais que possam influenciar a prestação do serviço.",
        ],
      },
      {
        paragraphs: [
          "A omissão de informação relevante por parte do cliente poderá comprometer a execução do serviço, sem que daí resulte responsabilidade para a Yourguidealgarve.com quando tal impossibilidade não lhe seja imputável.",
        ],
      },
      {
        heading: "10. Propriedade intelectual",
        paragraphs: [
          "Todos os conteúdos presentes no website, incluindo textos, descrições, fotografias, imagens, vídeos, grafismos, marcas, logótipos, elementos visuais, estrutura, organização, base de dados e software, são protegidos por direitos de propriedade intelectual e pertencem à Yourguidealgarve.com ou a entidades terceiras que autorizaram a respetiva utilização.",
          "Nenhum conteúdo poderá ser reproduzido, distribuído, adaptado, disponibilizado ao público, armazenado ou utilizado para fins comerciais sem autorização prévia e escrita do respetivo titular.",
        ],
      },
      {
        heading: "11. Ligações para websites de terceiros",
        paragraphs: [
          "O website pode incluir ligações para websites, plataformas de reserva, redes sociais ou páginas de operadores terceiros. Essas ligações são disponibilizadas para conveniência do utilizador e não significam aprovação, controlo ou garantia sobre os respetivos conteúdos, serviços ou práticas.",
          "A Yourguidealgarve.com não é responsável pelo funcionamento, disponibilidade, legalidade, exatidão de conteúdos ou tratamento de dados realizado por entidades terceiras, recomendando-se a leitura dos respetivos termos e políticas antes de qualquer utilização.",
        ],
      },
      {
        heading: "12. Limitação de responsabilidade",
        paragraphs: [
          "A Yourguidealgarve.com envida esforços razoáveis para manter a informação do website atualizada e correta. No entanto, não garante que o website esteja sempre disponível, isento de erros, interrupções, falhas técnicas ou omissões.",
          "Na máxima medida permitida por lei, a Yourguidealgarve.com não será responsável por danos indiretos, lucros cessantes, perdas de oportunidade, falhas de comunicação, indisponibilidade temporária do website, vírus, interferências externas ou acontecimentos fora do seu controlo razoável.",
          "Também não poderá ser responsabilizada por alterações ou constrangimentos na execução de atividades causados por meteorologia, trânsito, acidentes, greves, encerramentos, decisões administrativas ou limitações impostas por terceiros prestadores.",
        ],
      },
      {
        heading: "13. Proteção de dados pessoais",
        paragraphs: [
          "O tratamento de dados pessoais realizado no contexto da utilização do website e da contratação de serviços é efetuado nos termos definidos na Política de Privacidade e, quando aplicável, na Política de Cookies, documentos que devem ser lidos em conjunto com os presentes Termos e Condições.",
        ],
      },
      {
        heading: "14. Alterações aos presentes termos",
        paragraphs: [
          "A Yourguidealgarve.com pode rever, modificar ou atualizar estes Termos e Condições a qualquer momento, sendo as alterações produzidas a partir da sua publicação no website, salvo disposição legal em contrário.",
          "Recomenda-se ao utilizador a consulta periódica desta página para verificar a versão em vigor.",
        ],
      },
      {
        heading: "15. Lei aplicável e resolução de litígios",
        paragraphs: [
          "Os presentes Termos e Condições regem-se pela lei portuguesa.",
          "Em caso de litígio, e sem prejuízo das normas imperativas de proteção do consumidor aplicáveis, será competente o foro legalmente determinado em Portugal. O consumidor poderá ainda recorrer, quando aplicável, a mecanismos de resolução alternativa de litígios de consumo nos termos da legislação em vigor.",
        ],
      },
      {
        heading: "16. Contactos",
        paragraphs: [
          "Para esclarecimentos relacionados com estes Termos e Condições ou com a utilização do website, o utilizador poderá utilizar os contactos disponibilizados pela Yourguidealgarve.com no website.",
        ],
      },
    ],
  },
  "pt-BR": {
    title: "Termos e Condições de Uso",
    updated: "Última atualização: 7 de maio de 2026",
    sections: [
      {
        heading: "1. Escopo e aceitação",
        paragraphs: [
          "Estes Termos e Condições regem o acesso, a navegação e o uso do site Yourguidealgarve.com, bem como o uso dos seus conteúdos, formulários, canais de contato e quaisquer serviços de reserva, turismo ou intermediação disponibilizados online.",
          "Ao acessar ou usar este site, o usuário confirma que leu, compreendeu e aceitou estes Termos e Condições. Em caso de discordância, deve abster-se de usar o site e seus serviços.",
        ],
      },
      {
        heading: "2. Identificação da empresa",
        paragraphs: [
          "Este site é operado pela Yourguidealgarve.com.",
          "Sempre que necessário, as comunicações relacionadas ao uso do site, pedidos de informação, reservas ou questões legais podem ser feitas pelos contatos disponíveis no próprio site.",
        ],
      },
      {
        heading: "3. Finalidade do site e dos serviços",
        paragraphs: [
          "A Yourguidealgarve.com disponibiliza, pelo site, informações e acesso a serviços de turismo no Algarve, incluindo, entre outros, passeios, experiências, visitas guiadas, atividades de lazer, transfers, propostas personalizadas e conteúdos informativos sobre destinos e atividades.",
          "As informações exibidas no site têm caráter informativo e comercial. As condições específicas de cada serviço — preço, duração, ponto de encontro, requisitos, envolvimento de terceiros, regras de cancelamento e disponibilidade — serão exibidas na página do produto, proposta comercial ou fluxo de reserva.",
        ],
      },
      {
        heading: "4. Condições de uso",
        paragraphs: [
          "O usuário compromete-se a usar o site de forma lícita, responsável e adequada, abstendo-se de qualquer conduta que possa prejudicar os direitos da Yourguidealgarve.com, de outros usuários ou de terceiros.",
          "Em particular, é proibido:",
        ],
        bullets: [
          "Usar o site para fins ilegais, fraudulentos ou de má-fé.",
          "Enviar ou transmitir vírus, malware ou qualquer material tecnologicamente nocivo.",
          "Tentar acessar áreas restritas, sistemas, servidores ou bancos de dados sem autorização.",
          "Copiar, reproduzir, extrair, republicar ou explorar comercialmente conteúdos do site sem autorização prévia por escrito.",
          "Utilizar ferramentas automatizadas, métodos de scraping ou técnicas similares sem autorização expressa.",
        ],
      },
      {
        heading: "5. Reservas e contratação",
        paragraphs: [
          "As reservas podem ser feitas pelo site, por formulário, contato direto ou plataformas de reserva integradas ou parceiras, conforme o serviço.",
          "Enviar um pedido de reserva não garante, por si só, a confirmação do serviço. A reserva só é definitiva após confirmação expressa da Yourguidealgarve.com ou do operador parceiro, podendo depender de disponibilidade, validação de informações e, quando aplicável, pagamento total ou parcial.",
          "A Yourguidealgarve.com pode atuar como organizadora, revendedora ou intermediária dos serviços, conforme a natureza da experiência. Quando o serviço for prestado por um parceiro terceiro, os termos próprios desse fornecedor também podem se aplicar e devem ser lidos antes da conclusão da reserva.",
        ],
      },
      {
        heading: "6. Preços e pagamentos",
        paragraphs: [
          "Salvo indicação em contrário, os preços exibidos no site estão em euros e incluem IVA à alíquota legal em vigor.",
          "Os pagamentos podem ser realizados pelos meios disponíveis no momento da reserva. A aceitação de um método específico depende da solução técnica adotada pelo site ou pela plataforma parceira.",
          "A Yourguidealgarve.com pode alterar preços, corrigir erros evidentes, atualizar campanhas ou retirar ofertas comerciais a qualquer momento, sem afetar reservas já confirmadas.",
        ],
      },
      {
        heading: "7. Cancelamentos, alterações e não comparecimento",
        paragraphs: [
          "Cada atividade pode estar sujeita a regras próprias de cancelamento, alteração ou reagendamento, indicadas no processo de reserva ou na descrição do serviço.",
          "Quando o cancelamento é solicitado dentro do prazo, o cliente pode ter direito a reembolso total ou parcial conforme as condições do serviço. Fora desse prazo, ou em caso de não comparecimento no local, data e hora combinados, pode não haver direito a reembolso.",
          "A Yourguidealgarve.com ou o parceiro pode alterar, suspender ou cancelar atividades por motivo de força maior, segurança, condições meteorológicas adversas, restrições operacionais, determinação de autoridades competentes ou outras circunstâncias fora do seu controle razoável. Nesses casos, sempre que possível, será oferecida alternativa, reagendamento ou solução adequada.",
        ],
      },
      {
        heading: "8. Direito de arrependimento",
        paragraphs: [
          "Em contratos a distância, o consumidor pode beneficiar-se do direito legal de arrependimento, quando aplicável pela lei portuguesa.",
          "Esse direito pode não se aplicar a serviços de lazer, turismo ou atividades com data ou período específico, ou quando o serviço tiver sido prestado integralmente com o consentimento prévio do consumidor, nos termos da legislação aplicável.",
        ],
      },
      {
        heading: "9. Responsabilidades do cliente",
        paragraphs: [
          "O cliente é responsável por fornecer informações corretas, completas e atualizadas no momento da reserva e por verificar com atenção todos os detalhes da confirmação recebida.",
          "Cabe ao cliente também:",
        ],
        bullets: [
          "Chegar pontualmente ao ponto de encontro indicado.",
          "Garantir que cumpre os requisitos físicos, documentais e de idade exigidos para a participação.",
          "Seguir todas as instruções de segurança da equipe da Yourguidealgarve.com ou do operador parceiro.",
          "Informar previamente eventuais limitações de mobilidade, condições médicas relevantes, alergias ou necessidades especiais que possam afetar o serviço.",
        ],
      },
      {
        paragraphs: [
          "A omissão de informações relevantes por parte do cliente pode comprometer a prestação do serviço, sem que isso gere responsabilidade para a Yourguidealgarve.com quando essa impossibilidade não lhe for imputável.",
        ],
      },
      {
        heading: "10. Propriedade intelectual",
        paragraphs: [
          "Todo o conteúdo do site — textos, descrições, fotos, imagens, vídeos, gráficos, marcas, logos, elementos visuais, estrutura, organização, banco de dados e software — é protegido por direitos de propriedade intelectual e pertence à Yourguidealgarve.com ou a terceiros que autorizaram seu uso.",
          "Nenhum conteúdo pode ser reproduzido, distribuído, adaptado, disponibilizado ao público, armazenado ou usado comercialmente sem autorização prévia, escrita, do titular.",
        ],
      },
      {
        heading: "11. Links para sites de terceiros",
        paragraphs: [
          "O site pode conter links para sites de terceiros, plataformas de reservas, redes sociais ou páginas de operadores parceiros. Esses links são fornecidos por conveniência e não implicam aprovação, controle ou garantia sobre o conteúdo, serviços ou práticas.",
          "A Yourguidealgarve.com não se responsabiliza pelo funcionamento, disponibilidade, legalidade, exatidão dos conteúdos ou tratamento de dados realizado por terceiros, recomendando a leitura dos respectivos termos e políticas antes do uso.",
        ],
      },
      {
        heading: "12. Limitação de responsabilidade",
        paragraphs: [
          "A Yourguidealgarve.com faz esforços razoáveis para manter as informações do site precisas e atualizadas. No entanto, não garante disponibilidade contínua nem ausência de erros, interrupções, falhas técnicas ou omissões.",
          "Na medida máxima permitida por lei, a Yourguidealgarve.com não responde por danos indiretos, lucros cessantes, perda de oportunidade, falhas de comunicação, indisponibilidade temporária, vírus, interferências externas ou eventos fora do seu controle razoável.",
          "A Yourguidealgarve.com também não responde por alterações ou restrições nas atividades causadas por clima, trânsito, acidentes, greves, fechamentos, decisões administrativas ou limitações impostas por terceiros prestadores.",
        ],
      },
      {
        heading: "13. Proteção de dados pessoais",
        paragraphs: [
          "Os dados pessoais tratados no uso do site e na contratação de serviços serão tratados conforme a Política de Privacidade e, quando aplicável, a Política de Cookies, que devem ser lidas em conjunto com estes Termos.",
        ],
      },
      {
        heading: "14. Alterações destes termos",
        paragraphs: [
          "A Yourguidealgarve.com pode revisar, modificar ou atualizar estes Termos a qualquer momento. As alterações entram em vigor com a publicação no site, salvo se a lei exigir de outra forma.",
          "Recomenda-se a consulta periódica desta página para acompanhar a versão em vigor.",
        ],
      },
      {
        heading: "15. Lei aplicável e resolução de litígios",
        paragraphs: [
          "Estes Termos regem-se pela lei portuguesa.",
          "Em caso de disputa, e sem prejuízo de normas imperativas de defesa do consumidor, a competência será do foro definido pela legislação em Portugal. O consumidor também pode, quando aplicável, recorrer a mecanismos alternativos de resolução de conflitos previstos na lei.",
        ],
      },
      {
        heading: "16. Contato",
        paragraphs: [
          "Para qualquer dúvida sobre estes Termos ou sobre o uso do site, use os contatos disponíveis no site da Yourguidealgarve.com.",
        ],
      },
    ],
  },
};

// =====================================================================
// PARTNERS — /parceiros (no PDF, written based on context)
// =====================================================================

const PARTNERS: Record<Locale, LegalPage> = {
  en: {
    title: "Become a partner",
    intro: [
      "Run a tour, experience or activity in the Algarve? We'd love to feature you on YouGuideAlgarve.",
      "We promote partner experiences to English-speaking travelers planning their trip, and connect them directly to your booking system — so you keep your operations exactly the way they work today.",
    ],
    sections: [
      {
        heading: "How it works",
        bullets: [
          "Send us your tour details, photos and the booking widget from your reservation system (Rezdy, FareHarbor, Pluralo, or any other).",
          "We publish a dedicated page in English for your activity, embedded with your widget so visitors book directly with you.",
          "Our team handles the marketing, content and customer questions in English — you focus on running great experiences.",
          "We work on a commission/affiliate basis through your existing booking platform: no extra integrations, no upfront cost.",
        ],
      },
      {
        heading: "Get in touch",
        paragraphs: [
          "If you'd like to be listed, write to us through the contact details on the site. Tell us a bit about your activity, where it runs, and the booking platform you use today, and we'll come back to you within a few business days.",
        ],
      },
    ],
  },
  "pt-PT": {
    title: "Torna-te parceiro",
    intro: [
      "Operas passeios, experiências ou atividades no Algarve? Adoraríamos divulgar-te no YouGuideAlgarve.",
      "Apresentamos experiências dos nossos parceiros a viajantes de língua inglesa que estão a planear a viagem, e ligamo-los diretamente ao teu sistema de reservas — para manteres a tua operação tal como a tens hoje.",
    ],
    sections: [
      {
        heading: "Como funciona",
        bullets: [
          "Envia-nos os detalhes do passeio, fotografias e o widget do teu sistema de reservas (Rezdy, FareHarbor, Pluralo ou outro).",
          "Publicamos uma página dedicada em inglês para a tua atividade, com o teu widget embutido, para que os visitantes reservem diretamente contigo.",
          "A nossa equipa trata do marketing, conteúdos e atendimento em inglês — tu focas-te em operar grandes experiências.",
          "Trabalhamos por comissão/afiliação através da tua plataforma de reservas atual: sem integrações extra, sem custo inicial.",
        ],
      },
      {
        heading: "Fala connosco",
        paragraphs: [
          "Para entrares para a lista, contacta-nos pelos meios disponibilizados no website. Diz-nos um pouco sobre a tua atividade, onde acontece e a plataforma de reservas que usas hoje, e respondemos em poucos dias úteis.",
        ],
      },
    ],
  },
  "pt-BR": {
    title: "Seja um parceiro",
    intro: [
      "Você opera passeios, experiências ou atividades no Algarve? Vamos adorar te ter no YouGuideAlgarve.",
      "Apresentamos experiências dos nossos parceiros a viajantes de língua inglesa que estão planejando a viagem, e os conectamos direto ao seu sistema de reservas — você mantém a sua operação exatamente como já funciona hoje.",
    ],
    sections: [
      {
        heading: "Como funciona",
        bullets: [
          "Envie os detalhes do passeio, fotos e o widget do seu sistema de reservas (Rezdy, FareHarbor, Pluralo ou outro).",
          "Publicamos uma página dedicada em inglês para a sua atividade, com o widget embutido, para que os visitantes reservem direto com você.",
          "Nosso time cuida do marketing, conteúdo e atendimento em inglês — você foca em entregar ótimas experiências.",
          "Trabalhamos por comissão/afiliação pela sua plataforma de reservas atual: sem integrações extras, sem custo inicial.",
        ],
      },
      {
        heading: "Fale com a gente",
        paragraphs: [
          "Para entrar na lista, fale com a gente pelos canais de contato do site. Conte um pouco sobre a sua atividade, onde acontece e a plataforma de reservas que você usa hoje, e respondemos em alguns dias úteis.",
        ],
      },
    ],
  },
};

export const LEGAL_CONTENT = {
  about: ABOUT,
  privacy: PRIVACY,
  terms: TERMS,
  partners: PARTNERS,
} as const;

export function getLegalPage(
  doc: keyof typeof LEGAL_CONTENT,
  locale: Locale,
): LegalPage {
  return LEGAL_CONTENT[doc][locale] ?? LEGAL_CONTENT[doc].en;
}
