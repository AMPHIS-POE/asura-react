// 파일 경로: src/pages/POE1/Feature/ShippingCalculator/HelpContent.js

export const helpContent = {
  ko: {
    title: '교역 계산기 가이드',
    sections: [
      {
        icon: '🎯',
        heading: '이 툴은 무엇인가요?',
        body: [
          '각 항구의 특산품과 자원별 보상을 정리하여 보여주는 "대화형 정보 안내서"입니다.',
          '수많은 교역 정보를 외우지 않아도, 간단한 클릭만으로 원하는 정보를 쉽게 찾을 수 있도록 돕는 것을 목표로 합니다.',
        ]
      },
      {
        icon: '🧭',
        heading: '사용 방법',
        list: [
          '[1] 가장 큰 목표인 [룬] 또는 [문신] 보상 유형을 선택합니다.',
          '[2] 해당 보상을 주는 항구 목록이 나타나면, 상세 정보가 궁금한 항구를 선택합니다.',
          '[3] 선택한 항구로 보낼 수 있는 모든 자원과, 그에 해당하는 보상 목록을 확인할 수 있습니다.',
        ]
      },
      {
        icon: '🧩',
        heading: '핵심 개념',
        body: [
          '이 툴은 복잡한 "계산기"가 아닙니다. 실시간 시세를 반영하지 않으며, 단지 정해진 교환 규칙에 대한 정보만을 제공합니다.',
          '자원별로 표시되는 "가치(Value)"는 실제 거래 가격이 아닌, 일반적인 선호도나 희귀도를 나타내는 참고용 점수입니다.',
        ]
      },
    ]
  },
  en: {
    title: 'Trade Calculator Guide',
    sections: [
      {
        icon: '🎯',
        heading: 'What is this tool?',
        body: [
          'This is an "Interactive Information Guide" that organizes and displays the specialties of each port and their rewards for specific resources.',
          'The goal is to help you easily find the trading information you need with simple clicks, without having to memorize numerous trade combinations.',
        ]
      },
      {
        icon: '🧭',
        heading: 'How to use',
        list: [
          '[1] Select your main goal: [Rune] or [Tattoo] reward type.',
          '[2] When the list of relevant ports appears, select the port you want to know more about.',
          '[3] You can then see a list of all resources that can be sent to that port and their corresponding rewards.',
        ]
      },
      {
        icon: '🧩',
        heading: 'Key Concepts',
        body: [
          'This tool is not a complex "calculator". It does not reflect real-time market prices but only provides information on fixed exchange rules.',
          'The "Value" displayed for each resource is not an actual trade price but a reference score indicating general preference or rarity.',
        ]
      },
    ]
  }
};