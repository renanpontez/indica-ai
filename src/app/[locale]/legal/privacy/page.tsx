import Link from 'next/link';
import Image from 'next/image';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

const content = {
  'pt-BR': {
    title: 'Política de Privacidade e Termos de Uso',
    lastUpdated: 'Efetiva a partir de 21 de Janeiro de 2026',
    backToHome: 'Voltar para o início',
    privacyTitle: 'Política de Privacidade',
    termsTitle: 'Termos de Uso',
    privacySections: [
      {
        title: '',
        content:
          'A sua privacidade é importante para nós. É política do Circle Picks respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Circle Picks, e outros sites que possuímos e operamos.',
      },
      {
        title: 'Coleta de Informações',
        content:
          'Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.',
      },
      {
        title: 'Dados que Coletamos',
        content: 'Coletamos apenas as informações necessárias para fornecer nosso serviço:',
        list: [
          'Email: Para criar e gerenciar sua conta',
          'Nome: Para identificação no aplicativo',
          'Foto de perfil: Para personalização da sua conta (opcional)',
          'Suas indicações: Os lugares e experiências que você compartilha na plataforma',
        ],
      },
      {
        title: 'Retenção de Dados',
        content:
          'Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.',
      },
      {
        title: 'Compartilhamento de Dados',
        content:
          'Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. Não vendemos seus dados para terceiros. Não usamos seus dados para marketing ou publicidade.',
      },
      {
        title: 'Links Externos',
        content:
          'O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.',
      },
      {
        title: 'Seus Direitos',
        content:
          'Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. Você também tem o direito de:',
        list: [
          'Acessar seus dados pessoais',
          'Corrigir informações incorretas',
          'Solicitar a exclusão da sua conta e dados',
          'Exportar seus dados',
        ],
      },
      {
        title: 'Compromisso do Usuário',
        content:
          'O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Circle Picks oferece no site e com caráter enunciativo, mas não limitativo:',
        list: [
          'Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública',
          'Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos',
          'Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Circle Picks, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos',
        ],
      },
      {
        title: 'Aceitação',
        content:
          'O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.',
      },
    ],
    termsSections: [
      {
        title: 'Aceitação dos Termos',
        content:
          'Ao acessar ou usar o Circle Picks ("Serviço"), você concorda em cumprir estes Termos de Uso. Se você não concordar com alguma parte destes termos, não poderá acessar o Serviço.',
      },
      {
        title: 'Descrição do Serviço',
        content:
          'O Circle Picks é uma plataforma que permite aos usuários compartilhar e descobrir recomendações de lugares como restaurantes, cafés, bares, hotéis e outras experiências através de sua rede de amigos e da comunidade.',
      },
      {
        title: 'Conta do Usuário',
        content: 'Para usar o Serviço, você deve:',
        list: [
          'Ter pelo menos 13 anos de idade',
          'Fornecer informações verdadeiras e precisas ao criar sua conta',
          'Manter a segurança da sua senha',
          'Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta',
        ],
      },
      {
        title: 'Conteúdo do Usuário',
        content:
          'Você mantém a propriedade do conteúdo que compartilha no Circle Picks (suas indicações, fotos e comentários). Ao publicar conteúdo, você nos concede uma licença para exibir esse conteúdo na plataforma.',
      },
      {
        title: 'Conduta Proibida',
        content: 'Ao usar o Serviço, você concorda em NÃO:',
        list: [
          'Publicar conteúdo falso, enganoso ou ofensivo',
          'Violar direitos de propriedade intelectual de terceiros',
          'Usar o Serviço para fins ilegais',
          'Tentar acessar contas de outros usuários',
          'Fazer spam ou publicidade não solicitada',
          'Coletar dados de outros usuários sem consentimento',
        ],
      },
      {
        title: 'Limitação de Responsabilidade',
        content:
          'O Circle Picks é fornecido "como está". Não garantimos que o Serviço será ininterrupto ou livre de erros. Não somos responsáveis por decisões tomadas com base nas recomendações de outros usuários.',
      },
      {
        title: 'Modificações do Serviço',
        content:
          'Reservamos o direito de modificar ou descontinuar o Serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis perante você ou terceiros por qualquer modificação, suspensão ou descontinuação do Serviço.',
      },
      {
        title: 'Encerramento',
        content:
          'Podemos encerrar ou suspender sua conta a qualquer momento, sem aviso prévio, por qualquer motivo, incluindo violação destes Termos. Você pode encerrar sua conta a qualquer momento entrando em contato conosco.',
      },
      {
        title: 'Alterações nos Termos',
        content:
          'Podemos atualizar estes Termos periodicamente. Notificaremos sobre mudanças significativas. O uso continuado do Serviço após as alterações constitui aceitação dos novos termos.',
      },
    ],
    contact: {
      title: 'Contato',
      content:
        'Se você tiver dúvidas sobre esta Política de Privacidade, Termos de Uso ou sobre seus dados, entre em contato conosco pelo email: hello@circlepicks.app',
    },
  },
  'en-US': {
    title: 'Privacy Policy and Terms of Use',
    lastUpdated: 'Effective as of January 21, 2026',
    backToHome: 'Back to home',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    privacySections: [
      {
        title: '',
        content:
          'Your privacy is important to us. It is the policy of Circle Picks to respect your privacy regarding any information we may collect on the Circle Picks website and other sites we own and operate.',
      },
      {
        title: 'Information Collection',
        content:
          'We only request personal information when we truly need it to provide you with a service. We do so by fair and lawful means, with your knowledge and consent. We also let you know why we are collecting it and how it will be used.',
      },
      {
        title: 'Data We Collect',
        content: 'We only collect information necessary to provide our service:',
        list: [
          'Email: To create and manage your account',
          'Name: For identification within the app',
          'Profile photo: For account personalization (optional)',
          'Your suggestions: The places and experiences you share on the platform',
        ],
      },
      {
        title: 'Data Retention',
        content:
          'We only retain collected information for as long as necessary to provide you with your requested service. When we store data, we protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.',
      },
      {
        title: 'Data Sharing',
        content:
          'We do not share personally identifying information publicly or with third parties, except when required by law. We do not sell your data to third parties. We do not use your data for marketing or advertising.',
      },
      {
        title: 'External Links',
        content:
          'Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies.',
      },
      {
        title: 'Your Rights',
        content:
          'You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You also have the right to:',
        list: [
          'Access your personal data',
          'Correct inaccurate information',
          'Request deletion of your account and data',
          'Export your data',
        ],
      },
      {
        title: 'User Commitment',
        content:
          'The user commits to making appropriate use of the content and information that Circle Picks offers on the site, including but not limited to:',
        list: [
          'Not engaging in activities that are illegal or contrary to good faith and public order',
          'Not spreading propaganda or content of a racist, xenophobic nature, any type of illegal pornography, terrorism apology, or against human rights',
          'Not causing damage to the physical (hardware) and logical (software) systems of Circle Picks, its suppliers, or third parties, to introduce or spread computer viruses or any other hardware or software systems capable of causing damage',
        ],
      },
      {
        title: 'Acceptance',
        content:
          'Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.',
      },
    ],
    termsSections: [
      {
        title: 'Acceptance of Terms',
        content:
          'By accessing or using Circle Picks ("Service"), you agree to comply with these Terms of Use. If you do not agree to any part of these terms, you may not access the Service.',
      },
      {
        title: 'Description of Service',
        content:
          'Circle Picks is a platform that allows users to share and discover recommendations for places such as restaurants, cafes, bars, hotels, and other experiences through their network of friends and the community.',
      },
      {
        title: 'User Account',
        content: 'To use the Service, you must:',
        list: [
          'Be at least 13 years old',
          'Provide true and accurate information when creating your account',
          'Maintain the security of your password',
          'Notify us immediately of any unauthorized use of your account',
        ],
      },
      {
        title: 'User Content',
        content:
          'You retain ownership of the content you share on Circle Picks (your recommendations, photos, and comments). By posting content, you grant us a license to display that content on the platform.',
      },
      {
        title: 'Prohibited Conduct',
        content: 'When using the Service, you agree NOT to:',
        list: [
          'Post false, misleading, or offensive content',
          'Violate intellectual property rights of third parties',
          'Use the Service for illegal purposes',
          'Attempt to access other users accounts',
          'Spam or post unsolicited advertising',
          'Collect data from other users without consent',
        ],
      },
      {
        title: 'Limitation of Liability',
        content:
          'Circle Picks is provided "as is". We do not guarantee that the Service will be uninterrupted or error-free. We are not responsible for decisions made based on recommendations from other users.',
      },
      {
        title: 'Service Modifications',
        content:
          'We reserve the right to modify or discontinue the Service at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.',
      },
      {
        title: 'Termination',
        content:
          'We may terminate or suspend your account at any time, without prior notice, for any reason, including violation of these Terms. You may terminate your account at any time by contacting us.',
      },
      {
        title: 'Changes to Terms',
        content:
          'We may update these Terms periodically. We will notify you of significant changes. Continued use of the Service after changes constitutes acceptance of the new terms.',
      },
    ],
    contact: {
      title: 'Contact',
      content:
        'If you have questions about this Privacy Policy, Terms of Use, or your data, contact us at: hello@circlepicks.app',
    },
  },
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content['pt-BR'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-divider">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/assets/circle-picks.svg"
              alt="Circle Picks logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="font-bold text-primary">Circle Picks</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-medium-grey hover:text-dark-grey transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t.backToHome}
        </Link>

        <h1 className="text-3xl font-bold text-dark-grey mb-2">{t.title}</h1>
        <p className="text-medium-grey mb-10">{t.lastUpdated}</p>

        {/* Privacy Policy Section */}
        <h2 className="text-2xl font-bold text-dark-grey mb-6 pb-2 border-b border-divider">
          {t.privacyTitle}
        </h2>
        <div className="space-y-8 mb-12">
          {t.privacySections.map((section, index) => (
            <section key={index}>
              {section.title && (
                <h3 className="text-xl font-semibold text-dark-grey mb-3">
                  {section.title}
                </h3>
              )}
              <p className="text-medium-grey leading-relaxed mb-3">
                {section.content}
              </p>
              {section.list && (
                <ul className="list-disc list-inside text-medium-grey space-y-2 ml-2">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Terms of Use Section */}
        <h2 className="text-2xl font-bold text-dark-grey mb-6 pb-2 border-b border-divider">
          {t.termsTitle}
        </h2>
        <div className="space-y-8 mb-12">
          {t.termsSections.map((section, index) => (
            <section key={index}>
              <h3 className="text-xl font-semibold text-dark-grey mb-3">
                {section.title}
              </h3>
              <p className="text-medium-grey leading-relaxed mb-3">
                {section.content}
              </p>
              {section.list && (
                <ul className="list-disc list-inside text-medium-grey space-y-2 ml-2">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="pt-6 border-t border-divider">
          <h3 className="text-xl font-semibold text-dark-grey mb-3">
            {t.contact.title}
          </h3>
          <p className="text-medium-grey leading-relaxed">
            {t.contact.content}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-divider py-8">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-medium-grey">
          © 2026 Circle Picks. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
