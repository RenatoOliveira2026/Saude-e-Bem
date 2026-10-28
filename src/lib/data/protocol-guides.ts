/**
 * Guias práticos dos protocolos: capa, preparação, plano semana a semana
 * e lembretes que a pessoa leva para a agenda do celular.
 *
 * Fica no código (e não no banco) porque alimenta componentes próprios da
 * página do protocolo; o texto livre continua editável pelo painel.
 *
 * Fotos: Unsplash, licença de uso livre (https://unsplash.com/license).
 */

export interface ProtocolGuideWeek {
  /** Ex.: "Semana 1" ou "Dias 1–5". */
  title: string;
  /** Primeiro e último dia do bloco (1 = dia de início). */
  fromDay: number;
  toDay: number;
  focus: string;
  tasks: string[];
}

export interface ProtocolGuideReminder {
  /** Horário local, "HH:MM". */
  time: string;
  title: string;
  detail: string;
}

export interface ProtocolGuide {
  cover: { url: string; alt: string };
  /** Tempo que o protocolo pede por dia. */
  dailyTime: string;
  /** Melhor momento para começar. */
  bestStart: string;
  /** O que deixar pronto antes do dia 1. */
  prepare: string[];
  /** Compras ou materiais (opcional). */
  shopping?: string[];
  /** Cuidados: quando falar com o médico antes ou parar. */
  alerts: string[];
  weeks: ProtocolGuideWeek[];
  /** Lembretes diários sugeridos para a agenda. */
  reminders: ProtocolGuideReminder[];
}

function photo(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
}

const MEDICAL_GENERIC =
  "Tem doença crônica, usa remédios todos os dias, está grávida ou amamentando? Mostre este protocolo ao seu médico antes de começar.";

export const PROTOCOL_GUIDES: Record<string, ProtocolGuide> = {
  // ---------------------------------------------------------------- SONO
  "sono-restaurador": {
    cover: { url: photo("1531353826977-0941b4779a1c"), alt: "Mulher dormindo tranquila sob as cobertas" },
    dailyTime: "Cerca de 30 minutos espalhados pelo dia, mais a rotina da noite",
    bestStart: "Comece numa segunda-feira: o primeiro fim de semana já vem com o horário de acordar treinado.",
    prepare: [
      "Escolha o horário fixo de acordar (o mesmo nos 7 dias da semana) e anote.",
      "Teste o quarto à noite: apague tudo e veja de onde entra luz.",
      "Defina onde o celular vai dormir, de preferência fora do quarto.",
      "Separe um caderno para anotar a hora que deitou, a hora que acordou e como se sentiu.",
    ],
    shopping: [
      "Máscara de dormir ou cortina blecaute (se entra luz)",
      "Despertador simples, para o celular sair do quarto",
      "Chá sem cafeína: camomila, erva-cidreira ou maracujá",
      "Protetor de ouvido (se há barulho)",
    ],
    alerts: [
      "Ronco alto, pausas na respiração ou muito sono durante o dia podem ser apneia: procure um médico antes, porque higiene do sono sozinha não resolve.",
      "Usa remédio para dormir? Não pare por conta própria; combine a redução com quem receitou.",
      "Nos primeiros dias é comum sentir mais sono à tarde. Evite dirigir sonolento.",
    ],
    weeks: [
      {
        title: "Dias 1–7",
        fromDay: 1,
        toDay: 7,
        focus: "Acertar o relógio do corpo",
        tasks: [
          "Acordar no horário escolhido todos os dias, mesmo depois de uma noite ruim.",
          "Até 30 minutos depois de acordar, 10 minutos de luz natural (janela aberta ou varanda).",
          "Último café ou chá preto até as 14h.",
          "Anotar no caderno: hora de deitar, de acordar e nota do sono de 0 a 10.",
        ],
      },
      {
        title: "Dias 8–14",
        fromDay: 8,
        toDay: 14,
        focus: "Quarto e rotina da noite",
        tasks: [
          "Quarto escuro, fresco (18 a 20 °C) e silencioso.",
          "Jantar leve até 3 horas antes de deitar.",
          "Telas desligadas 90 minutos antes: trocar por leitura, banho morno ou conversa.",
          "Respiração 4-7-8 já deitado: inspirar em 4, segurar 7, soltar em 8, por 4 ciclos.",
        ],
      },
      {
        title: "Dias 15–21",
        fromDay: 15,
        toDay: 21,
        focus: "Ajuste fino e manutenção",
        tasks: [
          "Ir para a cama só com sono. Sem sono em 20 minutos, levante e volte depois.",
          "Rever o caderno: em que dias o sono foi pior e o que aconteceu antes?",
          "Escolher as 3 regras que mais ajudaram e manter depois do protocolo.",
          "Se a nota do sono não passou de 5, leve o caderno a uma consulta.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Luz da manhã", detail: "10 minutos de luz natural logo cedo." },
      { time: "14:00", title: "Último café do dia", detail: "Depois deste horário, só bebidas sem cafeína." },
      { time: "21:00", title: "Desacelerar", detail: "Telas desligadas e rotina da noite: banho, leitura, respiração 4-7-8." },
    ],
  },

  "sono-reparador": {
    cover: { url: photo("1520206183501-b80df61043c2"), alt: "Pessoa dormindo apoiada em um travesseiro azul" },
    dailyTime: "Cerca de 20 minutos por dia, quase tudo à noite",
    bestStart: "Comece numa quinta-feira: os dias 3 e 4, que mexem no ambiente, caem no fim de semana.",
    prepare: [
      "Escolha o horário de acordar e o de deitar, com 7 a 8 horas entre eles.",
      "Coloque um despertador fora do alcance da cama.",
      "Avise quem mora com você sobre o novo horário de silêncio.",
    ],
    shopping: ["Máscara de dormir ou cortina mais escura", "Chá de camomila ou erva-cidreira"],
    alerts: [
      "Ronco forte ou engasgos à noite: procure um médico, pode ser apneia do sono.",
      "Não pare remédios para dormir sem orientação de quem receitou.",
    ],
    weeks: [
      {
        title: "Dias 1–2",
        fromDay: 1,
        toDay: 2,
        focus: "Horário fixo",
        tasks: [
          "Acordar no horário escolhido, sem soneca.",
          "Luz natural nos primeiros 30 minutos do dia.",
          "Anotar a que horas deitou e acordou.",
        ],
      },
      {
        title: "Dias 3–4",
        fromDay: 3,
        toDay: 4,
        focus: "Ambiente e luz",
        tasks: [
          "Escurecer o quarto e baixar a temperatura.",
          "Luzes da casa mais fracas depois das 20h.",
          "Celular fora do quarto ou em modo avião.",
        ],
      },
      {
        title: "Dias 5–7",
        fromDay: 5,
        toDay: 7,
        focus: "Rotina da noite",
        tasks: [
          "Mesma sequência todas as noites: banho morno, chá, leitura leve.",
          "Respiração lenta por 5 minutos já deitado.",
          "No dia 7, compare as anotações com as do dia 1.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Hora de levantar", detail: "Sem soneca. Abra a janela e pegue luz natural." },
      { time: "21:30", title: "Rotina da noite", detail: "Luzes baixas, telas desligadas, chá e leitura." },
    ],
  },

  // ---------------------------------------------------------------- ENERGIA
  "energia-diaria-premium": {
    cover: { url: photo("1662038271111-5b1c0b4157e8"), alt: "Caneca fumegante sobre a mesa diante de uma janela ensolarada" },
    dailyTime: "Cerca de 40 minutos ao longo do dia (a maior parte já faz parte da rotina)",
    bestStart: "Comece numa segunda-feira: os blocos de foco funcionam melhor em dias de trabalho.",
    prepare: [
      "Deixe uma garrafa de água cheia ao lado da cama na véspera.",
      "Escolha o lugar onde vai pegar sol pela manhã (janela, quintal, varanda).",
      "Planeje 3 cafés da manhã com proteína para a primeira semana.",
      "Marque na agenda um bloco de 90 minutos sem interrupções em cada dia útil.",
    ],
    shopping: [
      "Ovos, iogurte natural ou queijo branco (proteína no café da manhã)",
      "Aveia, frutas e castanhas",
      "Limões (para a água da manhã)",
      "Garrafa de água de pelo menos 1 litro",
    ],
    alerts: [
      "Cansaço que não melhora com descanso pode ter causa médica (anemia, tireoide, sono ruim). Se continuar depois dos 14 dias, peça exames.",
      "Tem pressão alta ou doença renal? Pule a pitada de sal na água da manhã.",
    ],
    weeks: [
      {
        title: "Dias 1–5",
        fromDay: 1,
        toDay: 5,
        focus: "Manhã que acorda o corpo",
        tasks: [
          "500 ml de água ao acordar, antes do café.",
          "10 a 15 minutos de luz natural + 5 minutos de alongamento.",
          "Primeiro bloco de foco de 90 minutos, com o celular no modo avião.",
          "Anotar a energia do dia de 0 a 10, às 16h.",
        ],
      },
      {
        title: "Dias 6–10",
        fromDay: 6,
        toDay: 10,
        focus: "Comida e pausas que sustentam",
        tasks: [
          "Café da manhã com proteína, gordura boa e fibra (ex.: ovos, pão integral e fruta).",
          "Almoço com metade do prato de vegetais e pouco carboidrato refinado.",
          "Pausa ativa de 10 minutos depois do almoço: caminhar ou subir escadas.",
          "Na queda das 15h, respiração lenta por 3 minutos em vez de doce.",
        ],
      },
      {
        title: "Dias 11–14",
        fromDay: 11,
        toDay: 14,
        focus: "Sua rotina pessoal",
        tasks: [
          "Ver nas anotações quais hábitos subiram mais a nota de energia.",
          "Montar a sua rotina com os 4 hábitos que funcionaram melhor.",
          "Jantar leve até 3 horas antes de dormir, para acordar com mais disposição.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água e luz", detail: "500 ml de água e 10 minutos de sol." },
      { time: "09:00", title: "Bloco de foco", detail: "90 minutos numa tarefa só. Celular no modo avião." },
      { time: "15:00", title: "Pausa ativa", detail: "10 minutos de caminhada ou respiração. Nada de doce." },
    ],
  },

  "energia-diaria": {
    cover: { url: photo("1631832293782-2eda7804489b"), alt: "Sol entrando pela janela ao lado de um vaso de planta" },
    dailyTime: "Cerca de 25 minutos por dia",
    bestStart: "Comece numa segunda-feira, com a semana de trabalho pela frente.",
    prepare: [
      "Deixe um copo ou garrafa de água ao lado da cama.",
      "Escolha um lugar com luz natural para os primeiros minutos do dia.",
      "Pense em 2 opções de café da manhã com proteína.",
    ],
    shopping: ["Ovos, iogurte ou queijo branco", "Frutas e aveia"],
    alerts: [
      "Cansaço forte e persistente pede avaliação médica: pode ser anemia, tireoide ou sono ruim.",
    ],
    weeks: [
      {
        title: "Dias 1–5",
        fromDay: 1,
        toDay: 5,
        focus: "Luz e água pela manhã",
        tasks: [
          "Um copo grande de água ao acordar.",
          "10 minutos de luz natural antes das 9h.",
          "Anotar a energia do dia de 0 a 10.",
        ],
      },
      {
        title: "Dias 6–10",
        fromDay: 6,
        toDay: 10,
        focus: "Comida e movimento",
        tasks: [
          "Café da manhã com proteína.",
          "Caminhada de 10 minutos depois do almoço.",
          "Trocar o doce da tarde por fruta e água.",
        ],
      },
      {
        title: "Dias 11–14",
        fromDay: 11,
        toDay: 14,
        focus: "Rotina que fica",
        tasks: [
          "Manter os 3 hábitos que mais ajudaram.",
          "Comparar a nota de energia com a dos primeiros dias.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água e luz", detail: "Um copo de água e 10 minutos de luz natural." },
      { time: "13:30", title: "Caminhada curta", detail: "10 minutos andando depois do almoço." },
    ],
  },

  // ---------------------------------------------------------------- ESTRESSE
  "reducao-estresse": {
    cover: { url: photo("1506126613408-eca07ce68773"), alt: "Mulher meditando sentada no chão de madeira" },
    dailyTime: "Cerca de 30 minutos por dia, em pausas curtas",
    bestStart: "Comece num dia mais tranquilo, como um sábado: as técnicas ficam mais fáceis de aprender sem pressa.",
    prepare: [
      "Escolha um canto da casa para os 5 minutos de respiração da manhã.",
      "Separe um caderno pequeno para o diário de 5 linhas e a gratidão.",
      "Descubra no celular como silenciar notificações por horário.",
      "Pense no trajeto da caminhada de 15 minutos (sem celular).",
    ],
    shopping: ["Caderno pequeno e caneta", "Fone de ouvido confortável (opcional, para relaxamento guiado)"],
    alerts: [
      "Crise de ansiedade frequente, tristeza que não passa ou pensamentos de se machucar: procure um psicólogo ou médico. Em crise, ligue 188 (CVV), 24 horas.",
      "Respiração lenta pode dar tontura no começo. Faça sentado e pare se ficar desconfortável.",
    ],
    weeks: [
      {
        title: "Dias 1–4",
        fromDay: 1,
        toDay: 4,
        focus: "Perceber o corpo e respirar",
        tasks: [
          "5 minutos de respiração pela barriga ao acordar (inspira 4, segura 4, solta 6).",
          "Pausa de 3 minutos antes do almoço, só prestando atenção na respiração.",
          "À noite, anotar 3 coisas boas do dia.",
        ],
      },
      {
        title: "Dias 5–10",
        fromDay: 5,
        toDay: 10,
        focus: "Ferramentas e limites",
        tasks: [
          "Identificar 1 situação que estressa e decidir como responder diferente.",
          "Dois blocos de 30 minutos por dia sem notificações.",
          "Caminhada de 15 minutos ao ar livre, sem celular.",
          "Diário de 5 linhas à tarde: o que sinto e do que preciso.",
        ],
      },
      {
        title: "Dias 11–14",
        fromDay: 11,
        toDay: 14,
        focus: "Plano para os dias difíceis",
        tasks: [
          "Relaxamento muscular progressivo de 10 minutos antes de dormir.",
          "Escrever o seu plano anti-recaída: os 3 sinais de alerta e o que fazer em cada um.",
          "Escolher a técnica favorita para usar sempre que o dia apertar.",
        ],
      },
    ],
    reminders: [
      { time: "07:30", title: "Respiração da manhã", detail: "5 minutos: inspira 4, segura 4, solta 6." },
      { time: "11:45", title: "Pausa de 3 minutos", detail: "Antes do almoço, só respirar e perceber o corpo." },
      { time: "21:30", title: "Gratidão e relaxamento", detail: "3 coisas boas do dia e relaxamento muscular." },
    ],
  },

  // ---------------------------------------------------------------- INTESTINO
  "saude-intestinal-premium": {
    cover: { url: photo("1610415946035-bad6fc9f5b8e"), alt: "Brócolis, couve-flor, framboesas, cogumelos e pepino prontos para uma refeição" },
    dailyTime: "Cerca de 20 minutos por dia, mais o tempo das refeições sem pressa",
    bestStart: "Comece num domingo, logo depois de fazer as compras da semana.",
    prepare: [
      "Faça a lista de compras abaixo e vá ao mercado ou à feira antes do dia 1.",
      "Calcule sua meta de água: 30 a 35 ml por quilo de peso.",
      "Comece um diário de sintomas: inchaço, gases, ritmo do intestino (nota de 0 a 10).",
      "Tire da despensa os ultraprocessados que mais te tentam.",
    ],
    shopping: [
      "Feijão, lentilha ou grão-de-bico",
      "Aveia, chia ou linhaça",
      "Verduras e legumes variados para a semana",
      "Frutas com casca (maçã, pera) e banana",
      "Iogurte natural ou kefir",
      "Chás de camomila, erva-doce ou gengibre",
    ],
    alerts: [
      "Sangue nas fezes, perda de peso sem motivo, dor forte ou mudança do intestino que dura semanas: procure um médico antes de começar.",
      "Aumente as fibras devagar e beba mais água junto. Fibra demais de uma vez causa gases e desconforto.",
      "Tem doença inflamatória intestinal, síndrome do intestino irritável ou faz dieta especial? Ajuste com seu médico ou nutricionista.",
    ],
    weeks: [
      {
        title: "Semana 1",
        fromDay: 1,
        toDay: 7,
        focus: "Tirar o que irrita e observar",
        tasks: [
          "Cortar refrigerantes, frituras e ultraprocessados.",
          "Mastigar bem: pelo menos 20 minutos por refeição.",
          "Atingir a meta de água todos os dias.",
          "Anotar no diário o que comeu e como o intestino respondeu.",
        ],
      },
      {
        title: "Semana 2",
        fromDay: 8,
        toDay: 14,
        focus: "Fibras e fermentados",
        tasks: [
          "Uma porção de feijão, lentilha ou grão-de-bico por dia.",
          "Uma porção de iogurte natural ou kefir por dia.",
          "Uma colher de aveia, chia ou linhaça no café da manhã.",
          "Caminhada leve de 10 minutos depois da maior refeição.",
        ],
      },
      {
        title: "Semana 3",
        fromDay: 15,
        toDay: 21,
        focus: "Seu cardápio",
        tasks: [
          "Chegar a 25 a 30 g de fibras por dia (vegetais em 2 refeições + leguminosas + fruta com casca).",
          "Rever o diário: que alimentos incomodaram e quais ajudaram?",
          "Montar um cardápio-base de 7 dias para continuar.",
          "Chá digestivo à noite: camomila, erva-doce ou gengibre.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água ao acordar", detail: "Um copo de água morna antes do café." },
      { time: "12:30", title: "Refeição sem pressa", detail: "Vegetais no prato e 20 minutos para comer." },
      { time: "20:30", title: "Chá e diário", detail: "Chá digestivo e 2 linhas no diário do intestino." },
    ],
  },

  "saude-intestinal": {
    cover: { url: photo("1494390248081-4e521a5940db"), alt: "Tigela de iogurte com frutas e uma xícara de café no café da manhã" },
    dailyTime: "Cerca de 15 minutos por dia, mais refeições com calma",
    bestStart: "Comece num domingo, depois das compras da semana.",
    prepare: [
      "Compre os itens da lista antes do dia 1.",
      "Anote como está o intestino hoje (nota de 0 a 10) para comparar no fim.",
      "Deixe uma garrafa de água sempre à vista.",
    ],
    shopping: [
      "Feijão, lentilha ou grão-de-bico",
      "Aveia ou linhaça",
      "Iogurte natural ou kefir",
      "Verduras, legumes e frutas para a semana",
    ],
    alerts: [
      "Sangue nas fezes, perda de peso sem motivo ou dor forte: procure um médico antes.",
      "Aumente as fibras aos poucos e beba mais água junto.",
    ],
    weeks: [
      {
        title: "Semana 1",
        fromDay: 1,
        toDay: 7,
        focus: "Tirar o que irrita",
        tasks: [
          "Menos frituras, refrigerantes e ultraprocessados.",
          "Comer devagar e mastigar bem.",
          "Água ao longo do dia.",
        ],
      },
      {
        title: "Semana 2",
        fromDay: 8,
        toDay: 14,
        focus: "Alimentos que ajudam",
        tasks: [
          "Uma porção de leguminosa por dia.",
          "Uma porção de iogurte natural ou kefir.",
          "Aveia ou linhaça no café da manhã.",
        ],
      },
      {
        title: "Semana 3",
        fromDay: 15,
        toDay: 21,
        focus: "Manter",
        tasks: [
          "Vegetais em duas refeições do dia.",
          "Caminhada leve depois do almoço.",
          "Comparar a nota do intestino com a do dia 1.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água ao acordar", detail: "Um copo grande de água antes do café." },
      { time: "12:30", title: "Prato com fibras", detail: "Vegetais e leguminosa no almoço, comendo devagar." },
    ],
  },

  // ---------------------------------------------------------------- HÁBITOS / HIDRATAÇÃO / DETOX
  "habitos-saudaveis-30-dias": {
    cover: { url: photo("1758798469179-dea5d63257ba"), alt: "Grupo de pessoas maduras se exercitando juntas num parque" },
    dailyTime: "Cerca de 30 minutos por dia, em pequenos blocos",
    bestStart: "Comece no dia 1 de um mês ou numa segunda-feira, para os 30 dias ficarem fáceis de contar.",
    prepare: [
      "Defina o horário de acordar e o de dormir (7 a 8 horas de janela).",
      "Imprima ou abra o checklist de hábitos e deixe à vista.",
      "Escolha o movimento de 10 minutos: caminhada, alongamento ou treino curto.",
      "Convide alguém para fazer junto. Em dupla, fica mais fácil não desistir.",
    ],
    shopping: ["Garrafa de água de 1 litro", "Verduras e legumes coloridos para a semana", "Tênis confortável para caminhar"],
    alerts: [MEDICAL_GENERIC, "Sentiu dor no peito, falta de ar ou tontura durante o movimento? Pare e procure atendimento."],
    weeks: [
      {
        title: "Semana 1",
        fromDay: 1,
        toDay: 7,
        focus: "Sono, água e movimento mínimo",
        tasks: [
          "Acordar no horário e beber 1 copo de água.",
          "10 minutos de movimento por dia.",
          "Dormir no horário planejado.",
        ],
      },
      {
        title: "Semanas 2–3",
        fromDay: 8,
        toDay: 21,
        focus: "Comida e pausas",
        tasks: [
          "Uma refeição 'arco-íris' por dia: metade do prato com vegetais.",
          "Pausa de 5 minutos sem tela a cada 2 horas.",
          "Telas desligadas 60 minutos antes de dormir.",
          "Marcar no checklist todos os dias.",
        ],
      },
      {
        title: "Semana 4",
        fromDay: 22,
        toDay: 30,
        focus: "Revisão e próximos 30 dias",
        tasks: [
          "Ver no checklist quais hábitos já são automáticos.",
          "Escolher 1 hábito novo para os próximos 30 dias.",
          "Comemorar o que foi feito, sem cobrar perfeição.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água e movimento", detail: "Um copo de água e 10 minutos de movimento." },
      { time: "15:00", title: "Pausa sem tela", detail: "5 minutos longe das telas: levante, alongue, beba água." },
      { time: "21:30", title: "Checklist do dia", detail: "Marque os hábitos de hoje e desligue as telas." },
    ],
  },

  "hidratacao-inteligente": {
    cover: { url: photo("1548780607-46c78f38182d"), alt: "Mão segurando um copo cheio de água" },
    dailyTime: "Menos de 5 minutos por dia: é só lembrar de beber",
    bestStart: "Pode começar em qualquer dia. Se possível, num dia em que você fica em casa, para criar o hábito.",
    prepare: [
      "Calcule sua meta: 30 a 35 ml por quilo (ex.: 70 kg dá 2,1 a 2,4 litros).",
      "Escolha uma garrafa e descubra quantas vezes precisa enchê-la por dia.",
      "Coloque a garrafa onde você passa mais tempo (mesa, bancada da cozinha).",
    ],
    shopping: ["Garrafa reutilizável de 500 ml a 1 litro", "Limões"],
    alerts: [
      "Tem insuficiência cardíaca, doença renal ou restrição de líquidos? Siga a quantidade que o seu médico indicou, não a desta conta.",
      "Pressão alta: pule a pitada de sal na água.",
    ],
    weeks: [
      {
        title: "Dias 1–3",
        fromDay: 1,
        toDay: 3,
        focus: "Meta e âncoras",
        tasks: [
          "2 copos de água ao acordar, antes do café.",
          "1 copo antes de cada refeição.",
          "Anotar quanto bebeu no fim do dia.",
        ],
      },
      {
        title: "Dias 4–7",
        fromDay: 4,
        toDay: 7,
        focus: "Lembretes e ajuste",
        tasks: [
          "Encher a garrafa de manhã e no começo da tarde.",
          "Um copo de água com limão (e uma pitada de sal, se liberado).",
          "Observar a cor da urina: amarelo-claro é o objetivo.",
        ],
      },
      {
        title: "Dias 8–10",
        fromDay: 8,
        toDay: 10,
        focus: "Manutenção",
        tasks: [
          "Bater a meta sem precisar de lembrete.",
          "Beber mais nos dias quentes ou com exercício.",
        ],
      },
    ],
    reminders: [
      { time: "07:00", title: "Água ao acordar", detail: "2 copos antes do café." },
      { time: "10:30", title: "Encher a garrafa", detail: "Confira se já bebeu metade da meta até o almoço." },
      { time: "15:30", title: "Segunda garrafa", detail: "Encha de novo e mantenha à vista." },
    ],
  },

  "detox-natural": {
    cover: { url: photo("1627435601361-ec25f5b1d0e5"), alt: "Caneca de vidro com chá de folhas verdes" },
    dailyTime: "Cerca de 20 minutos por dia, mais o preparo das refeições",
    bestStart: "Comece num domingo, depois das compras, e evite semanas com festas ou viagens.",
    prepare: [
      "Faça as compras da lista antes do dia 1.",
      "Combine com a família: 10 dias sem álcool e com menos ultraprocessados em casa.",
      "Planeje 3 jantares simples com vegetais para a primeira semana.",
    ],
    shopping: [
      "Brócolis, couve, repolho ou couve-flor",
      "Frutas da estação",
      "Chás sem açúcar (verde, hortelã, gengibre)",
      "Feijão, arroz integral e ovos",
    ],
    alerts: [
      "Fígado e rins já fazem a limpeza do corpo. Nenhum chá, suco ou jejum 'desintoxica' sozinho: este protocolo só dá a eles condições melhores.",
      "Não substitua refeições por sucos nem faça jejum prolongado.",
      MEDICAL_GENERIC,
    ],
    weeks: [
      {
        title: "Dias 1–3",
        fromDay: 1,
        toDay: 3,
        focus: "Água e verduras",
        tasks: [
          "Meta de água diária (30 a 35 ml por quilo).",
          "Uma porção de crucíferas por dia: brócolis, couve, repolho.",
          "Sem álcool e sem refrigerante.",
        ],
      },
      {
        title: "Dias 4–7",
        fromDay: 4,
        toDay: 7,
        focus: "Apoio ao fígado",
        tasks: [
          "Menos fritura e açúcar.",
          "Caminhada de 20 minutos por dia.",
          "Dormir 7 a 8 horas.",
        ],
      },
      {
        title: "Dias 8–10",
        fromDay: 8,
        toDay: 10,
        focus: "Volta consciente",
        tasks: [
          "Reintroduzir aos poucos o que tirou e notar como o corpo reage.",
          "Escolher 2 hábitos para manter depois dos 10 dias.",
        ],
      },
    ],
    reminders: [
      { time: "07:30", title: "Água e chá", detail: "Copo de água ao acordar e um chá sem açúcar." },
      { time: "18:00", title: "Caminhada", detail: "20 minutos de caminhada leve." },
    ],
  },

  // ---------------------------------------------------------------- MOVIMENTO / FOCO / PESO
  "mobilidade-alongamento": {
    cover: { url: photo("1785301329245-21b8c344f20b"), alt: "Pessoa de cabelos grisalhos fazendo exercício de ponte sobre o tapete" },
    dailyTime: "15 a 20 minutos por dia",
    bestStart: "Comece em qualquer dia. Faça sempre no mesmo horário, de preferência de manhã ou no fim da tarde.",
    prepare: [
      "Separe um espaço de 2 x 1 metro livre no chão.",
      "Deixe o tapete e uma toalha dobrada sempre no mesmo lugar.",
      "Anote a rigidez de hoje de 0 a 10 (pescoço, costas, quadril).",
    ],
    shopping: ["Tapete de exercício ou toalha grossa", "Faixa elástica leve (opcional)", "Uma cadeira firme para apoio"],
    alerts: [
      "Alongamento dá sensação de tensão leve, nunca de dor. Se doer, diminua a amplitude.",
      "Teve cirurgia recente, prótese, hérnia ou osteoporose? Peça ao fisioterapeuta para adaptar os exercícios.",
      "Use a cadeira como apoio para equilíbrio sempre que precisar.",
    ],
    weeks: [
      {
        title: "Dias 1–5",
        fromDay: 1,
        toDay: 5,
        focus: "Coluna e quadril",
        tasks: [
          "2 minutos de aquecimento: círculos de pescoço, ombros e quadril.",
          "Gato-vaca e rotações de coluna: 3 minutos.",
          "Alongamento do flexor do quadril, 30 segundos de cada lado.",
          "Anotar a rigidez de 0 a 10.",
        ],
      },
      {
        title: "Dias 6–10",
        fromDay: 6,
        toDay: 10,
        focus: "Parte de trás das pernas e ombros",
        tasks: [
          "Posterior de coxa e panturrilha: 30 segundos cada lado.",
          "Abertura de peito no batente da porta: 3 x 30 segundos.",
          "Caminhada de 10 minutos para completar.",
        ],
      },
      {
        title: "Dias 11–14",
        fromDay: 11,
        toDay: 14,
        focus: "Sequência completa",
        tasks: [
          "Juntar tudo em 15 minutos, na ordem que for mais confortável.",
          "Terminar com 1 minuto de respiração lenta.",
          "Comparar a rigidez com a do dia 1.",
        ],
      },
    ],
    reminders: [{ time: "07:30", title: "Mobilidade", detail: "15 minutos no tapete: coluna, quadril, pernas e ombros." }],
  },

  "foco-produtividade": {
    cover: { url: photo("1730342754571-05cefe80919d"), alt: "Mulher trabalhando concentrada no notebook" },
    dailyTime: "Não toma tempo a mais: organiza o tempo que você já trabalha",
    bestStart: "Comece numa segunda-feira e escolha as prioridades no domingo à noite.",
    prepare: [
      "Defina onde o celular vai ficar durante o bloco de foco (outro cômodo é o ideal).",
      "Limpe a mesa: só o que você vai usar na tarefa principal.",
      "Combine com a família ou colegas os horários em que você não quer interrupções.",
      "Separe um caderno para as prioridades do dia.",
    ],
    shopping: ["Caderno ou bloco de notas", "Timer de cozinha (opcional, para não usar o celular)"],
    alerts: [
      "Dificuldade de concentração que atrapalha muito a vida há meses pode ter causa tratável (sono, ansiedade, depressão, TDAH). Converse com um profissional.",
    ],
    weeks: [
      {
        title: "Dias 1–4",
        fromDay: 1,
        toDay: 4,
        focus: "Prioridade e primeiro bloco",
        tasks: [
          "Na véspera, escolher no máximo 3 prioridades.",
          "Ritual de início: 2 minutos de respiração e abrir só a tarefa principal.",
          "Um bloco de 90 minutos com celular longe.",
        ],
      },
      {
        title: "Dias 5–10",
        fromDay: 5,
        toDay: 10,
        focus: "Ambiente e pausas",
        tasks: [
          "Pausa de 15 minutos com movimento e água entre os blocos.",
          "E-mails e mensagens num bloco único de 30 minutos à tarde.",
          "Revisão ao meio-dia: ainda estou na prioridade certa?",
        ],
      },
      {
        title: "Dias 11–14",
        fromDay: 11,
        toDay: 14,
        focus: "Sua rotina",
        tasks: [
          "Encerrar o dia listando o que foi feito e o que fica para amanhã.",
          "Descobrir seu melhor horário de foco e proteger esse horário.",
        ],
      },
    ],
    reminders: [
      { time: "08:30", title: "Bloco de foco", detail: "90 minutos na prioridade número 1. Celular longe." },
      { time: "16:00", title: "Bloco de mensagens", detail: "30 minutos para e-mails e recados, de uma vez." },
      { time: "18:00", title: "Fechamento do dia", detail: "Liste o que fez e as 3 prioridades de amanhã." },
    ],
  },

  "emagrecimento-saudavel": {
    cover: { url: photo("1546069901-ba9599a7e63c"), alt: "Prato com vegetais variados e proteína" },
    dailyTime: "Cerca de 45 minutos por dia (30 de movimento, o resto em planejamento)",
    bestStart: "Comece numa segunda-feira, com as compras feitas e as refeições da semana pensadas.",
    prepare: [
      "Anote peso, medida da cintura e uma foto de hoje, para comparar no fim.",
      "Planeje os cafés da manhã com proteína da primeira semana.",
      "Escolha os 2 dias fixos de treino de força.",
      "Instale um contador de passos ou use o do celular.",
    ],
    shopping: [
      "Ovos, frango, peixe, iogurte natural ou queijo branco",
      "Verduras e legumes para 2 refeições por dia",
      "Frutas para os lanches",
      "Tênis confortável",
    ],
    alerts: [
      "Diabetes, pressão alta ou uso de remédios para emagrecer: converse com o médico antes. A dose de alguns remédios pode precisar de ajuste quando a alimentação muda.",
      "A meta é perder de 0,5 a 1 kg por semana. Perder muito mais rápido costuma voltar.",
      "Histórico de transtorno alimentar? Faça este protocolo só com acompanhamento profissional.",
    ],
    weeks: [
      {
        title: "Semana 1",
        fromDay: 1,
        toDay: 7,
        focus: "Ponto de partida",
        tasks: [
          "Foto de cada prato ou anotação do que comeu.",
          "Café da manhã com pelo menos 25 g de proteína (ex.: 2 ovos + iogurte).",
          "Contar os passos para saber sua média atual.",
        ],
      },
      {
        title: "Semanas 2–3",
        fromDay: 8,
        toDay: 21,
        focus: "Comer um pouco menos e se mexer mais",
        tasks: [
          "Vegetais em 2 refeições por dia.",
          "8 a 10 mil passos ou 30 minutos de caminhada.",
          "Treino de força 2 vezes por semana.",
          "Última refeição 3 horas antes de dormir.",
        ],
      },
      {
        title: "Semana 4",
        fromDay: 22,
        toDay: 28,
        focus: "Ajuste e manutenção",
        tasks: [
          "Comparar peso, cintura e foto com o dia 1.",
          "Ver o que foi fácil manter e o que precisa de ajuste.",
          "Montar o plano das próximas 4 semanas.",
        ],
      },
    ],
    reminders: [
      { time: "07:30", title: "Café com proteína", detail: "Pelo menos 25 g de proteína no café da manhã." },
      { time: "18:00", title: "Movimento do dia", detail: "30 minutos de caminhada ou o treino de força." },
      { time: "20:00", title: "Cozinha fechada", detail: "Última refeição do dia; amanhã o café é com proteína." },
    ],
  },

  // ---------------------------------------------------------------- LONGEVIDADE / MENOPAUSA
  "longevidade-premium": {
    cover: { url: photo("1625690987114-86f5af994b49"), alt: "Casal de cabelos grisalhos caminhando de braços dados" },
    dailyTime: "Cerca de 45 minutos por dia, somando movimento, pausa e preparo das refeições",
    bestStart: "Marque primeiro a consulta e os exames de rotina; comece o dia 1 na semana seguinte.",
    prepare: [
      "Agende um check-up: pressão, glicemia, colesterol, vitamina D e outros que o médico indicar.",
      "Anote o ponto de partida: peso, cintura, pressão e quantos minutos caminha por semana.",
      "Escolha os dias de treino de força (2 por semana) e os horários de caminhada.",
      "Liste 5 pessoas com quem quer falar mais vezes.",
    ],
    shopping: [
      "Azeite de oliva, peixes, leguminosas e castanhas",
      "Verduras, legumes e frutas variadas",
      "Tênis de caminhada",
      "Um par de halteres leves ou faixa elástica",
    ],
    alerts: [
      "Faça o check-up antes de aumentar a intensidade dos exercícios, principalmente se tem doença do coração, pressão alta ou diabetes.",
      "Vitamina D e outros suplementos só com indicação médica e com exame antes.",
      "Dor no peito, falta de ar fora do normal ou tontura no exercício: pare e procure atendimento.",
    ],
    weeks: [
      {
        title: "Fase 1 (dias 1–30)",
        fromDay: 1,
        toDay: 30,
        focus: "Base e exames",
        tasks: [
          "Fazer os exames e levar os resultados ao médico.",
          "Caminhar 20 a 30 minutos, 5 vezes por semana.",
          "Trocar 1 refeição por dia pelo estilo mediterrâneo: vegetais, azeite, leguminosas.",
          "Horário fixo de sono, 7 a 8 horas.",
        ],
      },
      {
        title: "Fase 2 (dias 31–60)",
        fromDay: 31,
        toDay: 60,
        focus: "Os 5 pilares completos",
        tasks: [
          "150 minutos de caminhada por semana + 2 treinos de força.",
          "10 minutos por dia de prática contra o estresse (respiração, oração, meditação).",
          "Um contato significativo por dia: ligação, visita, encontro.",
          "Álcool só ocasional, no máximo 1 dose.",
        ],
      },
      {
        title: "Fase 3 (dias 61–90)",
        fromDay: 61,
        toDay: 90,
        focus: "Ajuste e manutenção",
        tasks: [
          "Revisar o ponto de partida e comparar.",
          "Aumentar devagar a carga do treino de força.",
          "Escolher o que vira rotina para o próximo trimestre.",
          "Marcar o próximo check-up.",
        ],
      },
    ],
    reminders: [
      { time: "07:30", title: "Movimento do dia", detail: "Caminhada ou treino de força, conforme o plano da semana." },
      { time: "12:30", title: "Prato mediterrâneo", detail: "Vegetais, azeite, leguminosas ou peixe." },
      { time: "19:00", title: "Conexão e calma", detail: "Fale com alguém querido e faça 10 minutos de respiração." },
    ],
  },

  "longevidade-saudavel": {
    cover: { url: photo("1773227060818-32d6e4300fba"), alt: "Casal idoso dançando e sorrindo um para o outro" },
    dailyTime: "Cerca de 40 minutos por dia",
    bestStart: "Faça os exames de rotina primeiro e comece na semana seguinte.",
    prepare: [
      "Agende o check-up e anote seus números de hoje (peso, cintura, pressão).",
      "Escolha 2 dias por semana para treino de força.",
      "Planeje as compras com mais vegetais, azeite e leguminosas.",
    ],
    shopping: ["Azeite, peixes, leguminosas e castanhas", "Verduras e frutas", "Tênis de caminhada"],
    alerts: [
      "Check-up antes de intensificar exercícios, principalmente com doença do coração, pressão alta ou diabetes.",
      "Suplementos só com indicação médica.",
    ],
    weeks: [
      {
        title: "Fase 1 (dias 1–30)",
        fromDay: 1,
        toDay: 30,
        focus: "Ponto de partida",
        tasks: ["Exames e consulta.", "Caminhada 5 vezes por semana.", "Sono com horário fixo."],
      },
      {
        title: "Fase 2 (dias 31–60)",
        fromDay: 31,
        toDay: 60,
        focus: "Os 5 pilares",
        tasks: [
          "Alimentação no estilo mediterrâneo.",
          "Treino de força 2 vezes por semana.",
          "10 minutos por dia contra o estresse.",
          "Mais tempo com amigos e família.",
        ],
      },
      {
        title: "Fase 3 (dias 61–90)",
        fromDay: 61,
        toDay: 90,
        focus: "Manter",
        tasks: ["Comparar com o ponto de partida.", "Marcar o próximo check-up."],
      },
    ],
    reminders: [
      { time: "07:30", title: "Movimento", detail: "Caminhada ou treino de força." },
      { time: "19:00", title: "Pausa e conexão", detail: "Respiração e uma conversa com alguém querido." },
    ],
  },

  "menopausa-saudavel": {
    cover: { url: photo("1759765468070-120cdc180be8"), alt: "Mulher madura de cabelos grisalhos sorrindo" },
    dailyTime: "Cerca de 40 minutos por dia",
    bestStart: "Comece logo depois de uma consulta com o ginecologista, se possível.",
    prepare: [
      "Comece um diário de sintomas: ondas de calor, sono, humor, articulações (nota de 0 a 10).",
      "Peça ao médico os exames de rotina e, se indicado, densitometria óssea.",
      "Escolha o horário dos treinos de força (2 a 3 vezes por semana).",
    ],
    shopping: [
      "Fontes de cálcio: iogurte, queijos, folhas verde-escuras, gergelim",
      "Proteína em todas as refeições: ovos, peixe, frango, leguminosas",
      "Linhaça ou soja (se o médico liberar)",
      "Roupas leves e um leque para as ondas de calor",
    ],
    alerts: [
      "Sangramento depois de 12 meses sem menstruar precisa de avaliação médica.",
      "Suplementos e reposição hormonal só com orientação do seu médico.",
      "Ondas de calor muito fortes ou tristeza persistente têm tratamento: fale com o ginecologista.",
    ],
    weeks: [
      {
        title: "Semana 1",
        fromDay: 1,
        toDay: 7,
        focus: "Mapear sintomas e comer melhor",
        tasks: [
          "Preencher o diário de sintomas todos os dias.",
          "Proteína em todas as refeições.",
          "Duas porções de alimentos com cálcio por dia.",
          "Anotar o que piora as ondas de calor (café, álcool, pimenta, estresse).",
        ],
      },
      {
        title: "Semana 2",
        fromDay: 8,
        toDay: 14,
        focus: "Movimento para ossos e coração",
        tasks: [
          "Treino de força 2 vezes na semana.",
          "Caminhada de 30 minutos nos outros dias.",
          "Levar ao médico as dúvidas sobre suplementos.",
        ],
      },
      {
        title: "Semanas 3–4",
        fromDay: 15,
        toDay: 30,
        focus: "Consolidar",
        tasks: [
          "Quarto fresco e roupas leves para dormir melhor.",
          "10 minutos de respiração lenta por dia.",
          "Comparar o diário de sintomas com o da primeira semana.",
        ],
      },
    ],
    reminders: [
      { time: "07:30", title: "Movimento", detail: "Treino de força ou caminhada, conforme o dia." },
      { time: "21:00", title: "Diário e respiração", detail: "Notas dos sintomas e 10 minutos de respiração lenta." },
    ],
  },
};

export function getProtocolGuide(slug: string): ProtocolGuide | null {
  return PROTOCOL_GUIDES[slug] ?? null;
}

/** "21 dias" → 21. Sem número reconhecível, usa o fim do último bloco. */
export function protocolDurationDays(duration: string | undefined, guide: ProtocolGuide): number {
  const match = duration?.match(/(\d+)/);
  const fromText = match ? Number(match[1]) : 0;
  const fromWeeks = Math.max(...guide.weeks.map((w) => w.toDay));
  return fromText > 0 ? Math.max(fromText, fromWeeks) : fromWeeks;
}
