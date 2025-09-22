// src/pages/POE1/Feature/VoriciCalculator/HelpContent.js
export const helpContent = {
  ko: {
    title: '가이드',
    sections: [
      {
        icon: '🎯',
        heading: '이 계산기는 무엇인가요?',
        body: [
          '현재 홈/색상 상태에서 목표 조합으로 가는 최저 기대비용을 다양한 경로를 비교하여 계산합니다.',
        ]
      },
      {
        icon: '📌',
        heading: '왜 필요한가요?',
        body: [
          'POE에서 장비의 홈 색상은 힘·민첩·지능과 같은 능력치 요구사항에 따라 확률에 차이가 존재합니다.',
          '이를 테면 힘 베이스 장비의 경우 빨강, 민첩은 초록, 지능은 파랑 홈의 등장확률이 높습니다.',
          '홈 색상과 컬러를 조정하는 것도 POE에서는 크래프팅의 일부이며, 적절한 과정을 통해 전체 비용을 크게 낮출 수 있습니다.'
        ]
      },
      {
        icon: '🧭',
        heading: '사용 방법',
        list: [
          '[1] 아이템의 힘·민첩·지능 요구치를 입력합니다.',
          '[2] 현재 장비의 홈 갯수와 색을 지정합니다.',
          '[3] 목표로 하는 홈 갯수와 색상을 지정합니다.',
          '(참고) 환율 설정은 기본적으로 POE.NINJA와 연동되지만, 직접 입력할 수도 있습니다.'
        ]
      },
      {
        icon: '🧩',
        heading: '핵심 개념',
        list: [
          '홈 갯수와 색상을 바꾸는 기본적인 방법은 색채의 오브와 쥬얼러 오브를 사용하는 것이지만, 은신처의 제작대를 활용하면 보다 효율적인 크래프팅이 가능합니다.',
          '제작대에는 홈 갯수 및 색상에 관한 여러 선택지가 존재하며, 일정한 비용을 지불하고 장비에 적용할 수 있습니다.',
          '(중요) 오프컬러란 제작대에서 홈의 갯수를 바꿀때, 기존 홈의 색상이 바뀌지 않는 것을 이용하는 크래프팅 기법입니다.',
          '(예시) 현재 장비의 색상이 빨/빨/빨/초라고 일때, 제작대에서 홈의 갯수를 3개로 낮추면 컬러는 여전히 빨/빨/빨로 남게됩니다.',
          '(방법론) 위 개념을 활용해, 기존 홈의 색상을 확정적으로 보전하면서 제작대에서 홈의 갯수를 늘리고 줄이고를 반복하여 원하는 색상을 얻는 방법입니다.',
        ]
      },
      {
        icon: '💡',
        heading: '팁',
        list: [
          '모든 장비는 같은 베이스여도 요구 능력치에 따라 색상 확률이 다릅니다.',
          '즉, 같은 지능 베이스여도 요구하는 지능이 높을수록 파랑색 홈의 확률이 높아져 빨강/초록 등의 색상이 붙을 가능성이 낮습니다.',
          '그래서 제작대에 존재하는 요구 능력치 감소 옵션을 붙인다면 색상 확률을 유리하게 만들 수 있습니다.',
          '단, 유니크 장비 또는 이미 장비의 속성이 가득차 있는 경우에는, 위 방법의 활용이 불가능합니다.'
        ]
      },
      {
        icon: '⚠️',
        heading: '모델 설명',
        body: [
          '독립 시도, 공개된 확률 모델에 근거합니다.',
          '링크 개념 및 퀄리티, 징조 등 특수 메커닉 등은 제외하고, 순수한 홈/색상 관련 계산만 수행합니다.'
        ]
      }
    ]
  },
  en: {
    title: 'Guide',
    sections: [
      {
        icon: '🎯',
        heading: 'What this calculator does',
        body: [
          'Calculates the lowest expected cost (in Chaos) to reach the desired socket/color configuration from your current state.',
          'Compares different crafting paths such as Chromatic Orb spam, Jeweller’s Orb rerolls, and bench recipes.'
        ]
      },
      {
        icon: '📌',
        heading: 'Why it matters',
        body: [
          'In Path of Exile, socket color probabilities are influenced by attribute requirements (STR/DEX/INT).',
          'For example, a Strength-based item favors red sockets, Dexterity favors green, and Intelligence favors blue.',
          'Adjusting socket colors is a fundamental part of crafting, and choosing the right method can reduce the overall cost dramatically.'
        ]
      },
      {
        icon: '🧭',
        heading: 'How to use',
        list: [
          '[1] Enter the item’s attribute requirements (STR/DEX/INT).',
          '[2] Specify the current socket count and each socket color.',
          '[3] Set the target socket count and desired color combination.',
          '(Note) Exchange rates are linked to POE.NINJA by default, but you can also input them manually.'
        ]
      },
      {
        icon: '🧩',
        heading: 'Key concepts',
        list: [
          'The basic way to change socket numbers and colors is by using Chromatic Orbs and Jeweller’s Orbs. However, the crafting bench in your hideout allows for more efficient strategies.',
          'The bench offers multiple options for socket count and color, applied to your item at a fixed cost.',
          '(Important) Off-color crafting refers to a technique where reducing socket count preserves the existing colors.',
          '(Example) If your item has R/R/R/G and you reduce the socket count to 3 at the bench, it remains R/R/R.',
          '(Method) By repeatedly increasing and decreasing sockets at the bench, you can preserve desired colors while working toward the full target combination.'
        ]
      },
      {
        icon: '💡',
        heading: 'Tips',
        list: [
          'Even items with the same base can have different color odds depending on their attribute requirements.',
          'For example, a high-INT base is much more likely to roll blue sockets and less likely to roll red or green.',
          'Bench modifiers that reduce attribute requirements can shift color odds in your favor.',
          'Unique items or gear with full affix slots may not allow this method to be applied.'
        ]
      },
      {
        icon: '⚠️',
        heading: 'Model notes',
        body: [
          'Based on independent roll attempts and published probability models.',
          'Excludes linking, quality, Omen, and other special mechanics—focus is purely on socket count and color outcomes.'
        ]
      }
    ]
  }
};
