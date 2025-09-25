export const regexHelpContent = {
  ko: {
    title: '정규식 검색 가이드',
    sections: [
      {
        icon: '🔎',
        heading: '정규식(Regex, RegularExpression)이란?',
        body: [
          '정규식은 문자열에서 특정한 패턴을 찾아내는 도구입니다.',
        ]
      },
      {
        icon: '✍️',
        heading: '왜 필요한가요?',
        list: [
          'POE에는 인게임 검색창이 존재하며, 이를 활용해 특정한 아이템을 거르거나 강조할 수 있습니다.',
          '필터링은 아이템의 이름이나 보유 속성 등을 기초로 진행됩니다.',
          '지도의 속성 중에는 빌드별로 지도를 매우 어렵게 만들거나 아예 플레이가 불가능하게 만드는 것들이 있습니다.',
          '이런 지도를 정규식을 통해 걸러 필터링 한다면 보다 수월한 맵핑을 진행할 수 있습니다',
          '마찬가지로 상점 정규식을 통해 캠페인 초반부를 보다 수월히 진행할 수 있습니다',
        ]
      },
      {
        icon: '🎯',
        heading: '어떻게 쓰나요?',
        body: [
          '추가하거나 제외하고 싶은 속성의 버튼을 클릭하시면 자동으로 정규식이 생성되며, 이걸 복사해서 인게임 필터에 넣으면 끝입니다.',
        ]
      },
      {
        icon: '💡',
        heading: 'TIP',
        list: [
          '고급 기능을 통해 지도의 속성 외에도 지도에 부여된 추가 화폐 수량 또는 갑충석 등의 값을 지정할 수 있습니다. ',
          '예시) 화폐 150% 이상 또는 화폐80% & 갑충석 80% 이상',
          '단, 인게임 필터의 근본적인 한계상 지나치게 복잡한 검색은 불가능합니다.',
        ]
      },
      {
        icon: '⚠️',
        heading: '주의사항',
        body: [
          '인게임 검색창은 250자라는 문자열 제한이 있습니다',
          '다만, 현실적으로 250자를 넘어서는 정규식이 필요할 가능성이 없으므로 크게 신경쓰실 필요는 없습니다.',
        ]
      }
    ]
  },
  en: {
    title: 'Regex Search Guide',
    sections: [
      {
        icon: '🔎',
        heading: 'What is a Regular Expression (Regex)?',
        body: [
          'A regex is a tool for finding specific patterns within text strings.',
        ]
      },
      {
        icon: '✍️',
        heading: 'Why Use It?',
        list: [
          'Path of Exile has an in-game search bar that lets you filter or highlight specific items.',
          'Filtering is based on an item\'s name, mods, and other properties.',
          'Certain map mods can make maps extremely difficult, or even impossible, for your build to run.',
          'By using regex to filter out these mods, you can ensure a smoother mapping experience.',
          'Similarly, using vendor regex can make the early campaign progression much easier.',
        ]
      },
      {
        icon: '🎯',
        heading: 'How to Use',
        body: [
          'Simply click the buttons for the mods you want to include or exclude. A regex string will be generated automatically. Just copy and paste it into the in-game search bar!',
        ]
      },
      {
        icon: '💡',
        heading: 'TIP',
        list: [
          'The advanced Options allows you to specify values for item quantity or scarabs in addition to map mods.',
          'Example: 150%+ item quantity Map, or 80%+ quantity AND 80%+ scarabs.',
          'However, due to the fundamental limits of the in-game search, overly complex queries may not work.',
        ]
      },
      {
        icon: '⚠️',
        heading: 'Important Notes',
        body: [
          'The in-game search bar has a 250-character limit.',
          'Realistically, you\'re very unlikely to need a regex that exceeds this limit, so it\'s not a major concern.',
        ]
      }
    ]
  }
};