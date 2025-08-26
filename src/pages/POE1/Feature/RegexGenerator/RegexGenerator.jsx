const MapModList = [
  {
    No: 1,
    mod: "몬스터가 물리 피해의 18%를 반사",
    engMod: "Monsters reflect 18% of Physical Damage",
    regex: "물.*%.*반",
    engregex: "f ph",
    tier17: false
  },
  {
    No: 2,
    mod: "몬스터가 원소 피해의 18%를 반사",
    engMod: "Monsters reflect 18% of Elemental Damage",
    regex: "원.*%.*반",
    engregex: "f el",
    tier17: false
  },
  {
    No: 3,
    mod: "플레이어가 비-저주 오라 스킬로 받는 효과 60% 감소",
    engMod: "Players have 60% reduced effect of Non-Curse Auras from Skills",
    regex: "오라",
    engregex: "non",
    tier17: false
  },
  {
    No: 4,
    mod: "플레이어의 모든 저항 최대치 (-12--9)%",
    engMod: "Players have (-12--9)% to all maximum Resistances",
    regex: "항.최",
    engregex: "o al",
    tier17: false
  },
  {
    No: 5,
    mod: "플레이어가 생명력, 마나 또는 에너지 보호막 재생 불가",
    engMod: "Players cannot Regenerate Life, Mana or Energy Shield",
    regex: "재생",
    engregex: "gen",
    tier17: false
  },
  {
    No: 6,
    mod: "플레이어의 생명력 및 에너지 보호막 회복 속도 60% 감폭",
    engMod: "Players have 60% less Recovery Rate of Life and Energy Shield",
    regex: "및.*감",
    engregex: "s rec",
    tier17: false
  },
  {
    No: 7,
    mod: "몬스터는 흡수 대상이 되지 않음",
    engMod: "Monsters cannot be Leeched from",
    regex: "는.흡",
    engregex: "om$",
    tier17: false
  },
  {
    No: 8,
    mod: "몬스터의 이동 속도 (25-30)% 증가<br>몬스터의 공격 속도 (35-45)% 증가<br>몬스터의 시전 속도 (35-45)% 증가",
    engMod: "(25-30)% increased Monster Movement Speed<br>(35-45)% increased Monster Attack Speed<br>(35-45)% increased Monster Cast Speed",
    regex: "동.속.*증",
    engregex: "r at",
    tier17: false
  },
  {
    No: 9,
    mod: "몬스터의 치명타 확률 (360-400)% 증가<br>몬스터의 치명타 피해 배율 +(41-45)%",
    engMod: "Monsters have (360-400)% increased Critical Strike Chance<br>+(41-45)% to Monster Critical Strike Multiplier",
    regex: "배율",
    engregex: "lier",
    tier17: false
  },
  {
    No: 10,
    mod: "몬스터가 물리 피해의 (31-35)%를 추가 카오스 피해로 획득<br>몬스터가 명중 시 2초 동안 위축 유발",
    engMod: "Monsters gain (31-35)% of their Physical Damage as Extra Chaos Damage<br>Monsters Inflict Withered for 2 seconds on Hit",
    regex: "축",
    engregex: "ered",
    tier17: false
  },
  {
    No: 11,
    mod: "몬스터가 (90-110)%의 추가 물리 피해를 냉기 속성으로 가함",
    engMod: "Monsters deal (90-110)% extra Physical Damage as Cold",
    regex: "기.속",
    engregex: "old$",
    tier17: false
  },
  {
    No: 12,
    mod: "몬스터가 (90-110)%의 추가 물리 피해를 화염 속성으로 가함",
    engMod: "Monsters deal (90-110)% extra Physical Damage as Fire",
    regex: "염.속",
    engregex: "fire$",
    tier17: false
  },
  {
    No: 13,
    mod: "몬스터가 (90-110)%의 추가 물리 피해를 번개 속성으로 가함",
    engMod: "Monsters deal (90-110)% extra Physical Damage as Lightning",
    regex: "개.속",
    engregex: "tn",
    tier17: false
  },
  {
    No: 14,
    mod: "몬스터가 투사체 2개 추가 발사",
    engMod: "Monsters fire 2 additional Projectiles",
    regex: "투.추",
    engregex: "tiles$",
    tier17: false
  },
  {
    No: 15,
    mod: "고유 보스가 주는 피해 25% 증가<br>고유 보스의 공격 및 시전 속도 30% 증가",
    engMod: "Unique Boss deals 25% increased Damage<br>Unique Boss has 30% increased Attack and Cast Speed",
    regex: "격.및",
    engregex: "d at",
    tier17: false
  },
  {
    No: 16,
    mod: "몬스터의 효과 범위 100% 증가",
    engMod: "Monsters have 100% increased Area of Effect",
    regex: "몬.*범",
    engregex: "m.*area",
    tier17: false
  },
  {
    No: 17,
    mod: "고유 보스의 생명력 35% 증가<br>고유 보스의 효과 범위 70% 증가",
    engMod: "Unique Boss has 35% increased Life<br>Unique Boss has 70% increased Area of Effect",
    regex: "고.*범",
    engregex: "d li",
    tier17: false
  },
  {
    No: 18,
    mod: "몬스터의 공격 명중 시 중독",
    engMod: "Monsters Poison on Hit",
    regex: "시.중",
    engregex: "son o",
    tier17: false
  },
  {
    No: 19,
    mod: "몬스터가 50%의 확률로 중독, 꿰뚫기, 출혈 회피",
    engMod: "Monsters have a 50% chance to avoid Poison, Impale, and Bleeding",
    regex: "출혈",
    engregex: "on,",
    tier17: false
  },
  {
    No: 20,
    mod: "몬스터의 스킬 2회 추가 연쇄",
    engMod: "Monsters' skills Chain 2 additional times",
    regex: "가.연",
    engregex: "l tim",
    tier17: false
  },
  {
    No: 21,
    mod: "몬스터 피해 (22-25)% 증가",
    engMod: "(22-25)% increased Monster Damage",
    regex: "터.피.*증",
    engregex: "%.*r d",
    tier17: false
  },
  {
    No: 22,
    mod: "몬스터의 정확도 50% 증가<br>플레이어가 방지하는 억제된 주문 피해 -20%",
    engMod: "Monsters have 50% increased Accuracy Rating<br>Players have -20% to amount of Suppressed Spell Damage Prevented",
    regex: "몬.*정",
    engregex: "rev",
    tier17: false
  },
  {
    No: 23,
    mod: "몬스터에게 걸리는 저주 효과 60% 감폭",
    engMod: "60% less effect of Curses on Monsters",
    regex: "주.*폭",
    engregex: "rses",
    tier17: false
  },
  {
    No: 24,
    mod: "플레이어가 쇠약화 저주에 걸림",
    engMod: "Players are Cursed with Enfeeble",
    regex: "쇠약",
    engregex: "h en",
    tier17: false
  },
  {
    No: 25,
    mod: "플레이어가 취약성 저주에 걸림",
    engMod: "Players are Cursed with Vulnerability",
    regex: "취약",
    engregex: "h vu",
    tier17: false
  },
  {
    No: 26,
    mod: "플레이어가 원소 약화 저주에 걸림",
    engMod: "Players are Cursed with Elemental Weakness",
    regex: "소.약",
    engregex: "h el",
    tier17: false
  },
  {
    No: 27,
    mod: "플레이어가 시간의 사슬 저주에 걸림",
    engMod: "Players are Cursed with Temporal Chains",
    regex: "사슬",
    engregex: "h tem",
    tier17: false
  },
  {
    No: 28,
    mod: "지역에 신성화 지대 존재",
    engMod: "Area has patches of Consecrated Ground",
    regex: "신성",
    engregex: "nse",
    tier17: false
  },
  {
    No: 29,
    mod: "지역에 얼음 지대 존재",
    engMod: "Area has patches of Chilled Ground",
    regex: "얼음",
    engregex: "hil",
    tier17: false
  },
  {
    No: 30,
    mod: "지역에 훼손된 지대 존재",
    engMod: "Area has patches of desecrated ground",
    regex: "훼손",
    engregex: "des",
    tier17: false
  },
  {
    No: 31,
    mod: "지역에 용암 지대 존재",
    engMod: "Area has patches of Burning Ground",
    regex: "암.지",
    engregex: "urn",
    tier17: false
  },
  {
    No: 32,
    mod: "지역에 #%만큼 피해가 증가한 감전 지대 존재",
    engMod: "Area has patches of Shocked Ground which increase Damage taken by 50%",
    regex: "감.*대",
    engregex: "cke",
    tier17: false
  },
  {
    No: 33,
    mod: "플레이어의 방어도 30% 감폭<br>플레이어의 막기 확률 40% 감소",
    engMod: "Players have 30% less Armour<br>Players have 40% reduced Chance to Block",
    regex: "어도",
    engregex: "arm",
    tier17: false
  },
  {
    No: 34,
    mod: "몬스터의 주문 피해 억제 확률 +60%",
    engMod: "Monsters have +60% chance to Suppress Spell Damage",
    regex: "제.확",
    engregex: "o su",
    tier17: false
  },
  {
    No: 35,
    mod: "몬스터가 치명타로 받는 추가 피해 (36-40)% 감소",
    engMod: "Monsters take (36-40)% reduced Extra Damage from Critical Strikes",
    regex: "치.*감",
    engregex: "kes",
    tier17: false
  },
  {
    No: 36,
    mod: "고유 보스가 사로잡힘",
    engMod: "Unique Bosses are Possessed",
    regex: "사로",
    engregex: "poss",
    tier17: false
  },
  {
    No: 37,
    mod: "몬스터가 최대 생명력의 (40-49)%를 추가 에너지 보호막 최대치로 획득",
    engMod: "Monsters gain (40-49)% of Maximum Life as Extra Maximum Energy Shield",
    regex: "치로",
    engregex: "m li",
    tier17: false
  },
  {
    No: 38,
    mod: "플레이어의 플라스크 충전량 50% 감소",
    engMod: "Players gain 50% reduced Flask Charges",
    regex: "전량",
    engregex: "k c",
    tier17: false
  },
  {
    No: 39,
    mod: "몬스터의 물리 피해 감소 +40%",
    engMod: "+40% Monster Physical Damage Reduction",
    regex: "해.감",
    engregex: "uct",
    tier17: false
  },
  {
    No: 40,
    mod: "몬스터가 70%의 확률로 원소 상태 이상 긴급회피",
    engMod: "Monsters have 70% chance to Avoid Elemental Ailments",
    regex: "급회",
    engregex: "d el",
    tier17: false
  },
  {
    No: 41,
    mod: "몬스터가 사술 방지 보유",
    engMod: "Monsters are Hexproof",
    regex: "사술",
    engregex: "re he",
    tier17: false
  },
  {
    No: 42,
    mod: "플레이어가 노출 유발 불가",
    engMod: "Players cannot inflict Exposure",
    regex: "노출",
    engregex: "ot i",
    tier17: false
  },
  {
    No: 43,
    mod: "미확인",
    engMod: "Unidentified Map",
    regex: "미확",
    engRegex: "fied m",
    tier17: false
  },
  {
    No: 44,
    mod: "몬스터의 생명력 (25-30)% 증폭<br>몬스터 기절 면역",
    engMod: "(25-30)% more Monster Life<br>Monsters cannot be Stunned",
    regex: "기절",
    engregex: "tun",
    tier17: false
  },
  {
    No: 45,
    mod: "몬스터의 생명력 (40-49)% 증폭",
    engMod: "(40-49)% more Monster Life",
    regex: "력.*증폭",
    engregex: "r li",
    tier17: false
  },
  {
    No: 46,
    mod: "몬스터의 카오스 저항 +25%<br>몬스터의 원소 저항 +40%",
    engMod: "+25% Monster Chaos Resistance<br>+40% Monster Elemental Resistances",
    regex: "카.*항",
    engregex: "r el",
    tier17: false
  },
  {
    No: 47,
    mod: "모든 몬스터의 적중 피해가 항상 점화 유발",
    engMod: "All Monster Damage from Hits always Ignites",
    regex: "항상",
    engregex: "lw",
    tier17: false
  },
  {
    No: 48,
    mod: "몬스터가 공격 시 60%의 확률로 꿰뚫음",
    engMod: "Monsters' Attacks have 60% chance to Impale on Hit",
    regex: "뚫음",
    engregex: "o im",
    tier17: false
  },
  {
    No: 49,
    mod: "몬스터가 명중 시 20%의 확률로 점화, 동결, 감전 유발",
    engMod: "Monsters have a 20% chance to Ignite, Freeze and Shock on Hit",
    regex: "전.유",
    engRegex: "te,",
    tier17: false
  },
  {
    No: 50,
    mod: "플레이어에게 적용되는 버프가 70% 더 빠르게 만료됨",
    engMod: "Buffs on Players expire 70% faster",
    regex: "플..*버",
    engregex: "fs",
    tier17: false
  },
  {
    No: 51,
    mod: "플레이어의 재사용 대기시간 회복 속도 40% 감폭",
    engMod: "Players have 40% less Cooldown Recovery Rate",
    regex: "대기",
    engregex: "coo",
    tier17: false
  },
  {
    No: 52,
    mod: "지역에 고유 보스 2마리 등장",
    engMod: "Area contains two Unique Bosses",
    regex: "2마",
    engregex: "two",
    tier17: false
  },
  {
    No: 53,
    mod: "몬스터 도발 면역<br>몬스터의 동작 속도가 기본 수치 밑으로 내려가지 않음<br>몬스터의 이동 속도가 기본 수치 밑으로 내려가지 않음",
    engMod: "Monsters cannot be Taunted<br>Monsters' Action Speed cannot be modified to below Base Value<br>Monsters' Movement Speed cannot be modified to below Base Value",
    regex: "도발",
    engregex: "elo",
    tier17: false
  },
  {
    No: 54,
    mod: "플레이어의 정확도 25% 감폭",
    engMod: "Players have 25% less Accuracy Rating",
    regex: "플.*정",
    engregex: "ss ac",
    tier17: false
  },
  {
    No: 55,
    mod: "몬스터가 명중 시 권능, 격분, 인내 충전 강탈",
    engMod: "Monsters steal Power, Frenzy and Endurance charges on Hit",
    regex: "강탈",
    engregex: "r,",
    tier17: false
  },
  {
    No: 56,
    mod: "몬스터가 명중 시 격분 충전 획득",
    engMod: "Monsters gain a Frenzy Charge on Hit",
    regex: "시.격",
    engregex: "zy c",
    tier17: false
  },
  {
    No: 57,
    mod: "몬스터가 명중 시 권능 충전 획득",
    engMod: "Monsters gain a Power Charge on Hit",
    regex: "시.권.*득",
    engregex: "a pow",
    tier17: false
  },
  {
    No: 58,
    mod: "몬스터가 명중 시 인내 충전 획득",
    engMod: "Monsters gain an Endurance Charge on Hit",
    regex: "시.인",
    engregex: "n en",
    tier17: false
  },
  {
    No: 59,
    mod: "플레이어의 효과 범위 25% 감폭",
    engMod: "Players have 25% less Area of Effect",
    regex: "플.*범",
    engregex: "ss are",
    tier17: false
  },
  {
    No: 60,
    mod: "몬스터가 명중 시 실명 유발",
    engMod: "Monsters Blind on Hit",
    regex: "실명",
    engregex: "s bli",
    tier17: false
  },
  {
    No: 61,
    mod: "몬스터의 주문 명중 시 이동 방해 유발",
    engMod: "Monsters Hinder on Hit with Spells",
    regex: "해.유",
    engregex: "hind",
    tier17: false
  },
  {
    No: 62,
    mod: "몬스터가 공격 명중 시 힘줄 절단 유발",
    engMod: "Monsters Maim on Hit with Attacks",
    regex: "힘줄",
    engregex: "aim",
    tier17: false
  },
  {
    No: 63,
    mod: "지역에 다수의 토템 존재",
    engMod: "Area contains many Totems",
    regex: "토.*존",
    engregex: "tot",
    tier17: false
  },
  {
    No: 64,
    mod: "지역에 등장하는 몬스터 종류 증가",
    engMod: "Area has increased monster variety",
    regex: "종류",
    engregex: "ety",
    tier17: false
  },
  {
    No: 65,
    mod: "지역에 흉물 서식",
    engMod: "Area is inhabited by Abominations",
    regex: "에.흉",
    engregex: "bom",
    tier17: false
  },
  {
    No: 66,
    mod: "지역에 솔라리스 광신도 거주",
    engMod: "Area is inhabited by Solaris fanatics",
    regex: "솔",
    engregex: "lar",
    tier17: false
  },
  {
    No: 67,
    mod: "지역에 인간형 적 서식",
    engMod: "Area is inhabited by Humanoids",
    regex: "간형",
    engregex: "hum",
    tier17: false
  },
  {
    No: 68,
    mod: "지역에 동물 서식",
    engMod: "Area is inhabited by Animals",
    regex: "동물",
    engregex: "nim",
    tier17: false
  },
  {
    No: 69,
    mod: "지역에 키타바 광신자 거주",
    engMod: "Area is inhabited by Cultists of Kitava",
    regex: "키타",
    engregex: "cul",
    tier17: false
  },
  {
    No: 70,
    mod: "지역에 염소인간 서식",
    engMod: "Area is inhabited by Goatmen",
    regex: "소인",
    engregex: "oa",
    tier17: false
  },
  {
    No: 71,
    mod: "지역에 루나리스 광신도 거주",
    engMod: "Area is inhabited by Lunaris fanatics",
    regex: "루",
    engregex: "una",
    tier17: false
  },
  {
    No: 72,
    mod: "지역에 악마 서식",
    engMod: "Area is inhabited by Demons",
    regex: "악",
    engregex: "emo",
    tier17: false
  },
  {
    No: 73,
    mod: "지역에 혼 서식",
    engMod: "Area is inhabited by Ghosts",
    regex: "혼.서",
    engregex: "ost",
    tier17: false
  },
  {
    No: 74,
    mod: "지역에 원거리형 몬스터 서식",
    engMod: "Area is inhabited by ranged monsters",
    regex: "리형",
    engregex: "ang",
    tier17: false
  },
  {
    No: 75,
    mod: "지역에 언데드 서식",
    engMod: "Area is inhabited by Undead",
    regex: "언",
    engregex: "ead",
    tier17: false
  },
  {
    No: 76,
    mod: "지역에 해골 서식",
    engMod: "Area is inhabited by Skeletons",
    regex: "해골",
    engregex: "eto",
    tier17: false
  },
  {
    No: 77,
    mod: "지역에 바다 마녀 및 유충 서식",
    engMod: "Area is inhabited by Sea Witches and their Spawn",
    regex: "녀",
    engregex: "ei",
    tier17: false
  },
  {
    No: 78,
    mod: "희귀 몬스터 수 (20-30)% 증가",
    engMod: "(20-30)% increased number of Rare Monsters",
    regex: "귀.*증",
    engregex: "d nu",
    tier17: false
  },
  {
    No: 79,
    mod: "마법 몬스터 (20-30)% 증가",
    engMod: "(20-30)% increased Magic Monsters",
    regex: "법.몬",
    engregex: "d mag",
    tier17: false
  },
  {
    No: 80,
    mod: "메이븐이 플레이어를 방해함",
    engMod: "The Maven interferes with Players",
    regex: "메이",
    engregex: "mav",
    tier17: true
  },
  {
    No: 81,
    mod: "플레이어의 흡수로 인한 초당 총 생명력, 마나, 에너지 보호막<br>회복량 최대치가 (50-60)% 감소",
    engMod: "Players have (50-60)% reduced Maximum total Life, Mana and Energy Shield Recovery per second from Leech",
    regex: "의.초",
    engregex: "eec",
    tier17: true
  },
  {
    No: 82,
    mod: "몬스터의 스킬 3회 추가 연쇄 몬스터의 투사체가<br>지형과 충돌 시 연쇄 가능",
    engMod: " Monsters' skills Chain 3 additional times Monsters' Projectiles can Chain when colliding with Terrain",
    regex: "충돌",
    engregex: "lid",
    tier17: true
  },
  {
    No: 83,
    mod: "플레이어들과 그 소환수가 10초마다 3초 동안 피해를 주지 않음",
    engMod: "Players and their Minions deal no damage for 3 out of every 10 seconds",
    regex: "과.그",
    engregex: "ever",
    tier17: true
  },
  {
    No: 84,
    mod: "몬스터의 효과 범위 100% 증가<br>몬스터가 투사체 2개 추가 발사",
    engMod: "Monsters have 100% increased Area of Effect<br>Monsters fire 2 additional Projectiles",
    regex: "가.발",
    engregex: "l pr",
    tier17: true
  },
  {
    No: 85,
    mod: "몬스터 피해 (30-40)% 증가",
    engMod: "(30-40)% increased Monster Damage",
    regex: "터.피.*증",
    engregex: "r damage$",
    tier17: true
  },

  {
    No: 86,
    mod: "희귀 몬스터 수 (35-45)% 증가<br>희귀 몬스터가 각각 속성 2개 추가 보유",
    engMod: "(35-45)% increased number of Rare Monsters<br>Rare Monsters each have 2 additional Modifiers",
    regex: "각.속",
    engregex: "s ea",
    tier17: true
  },

  {
    No: 87,
    mod: "몬스터가 물리 피해의 (180-200)%를<br>추가 무작위 원소 피해로 획득",
    engMod: " Monsters gain (180-200)% of their Physical Damage as Extra Damage of a random Element",
    regex: "무.*원",
    engregex: "om e",
    tier17: true
  },
  {
    No: 88,
    mod: "몬스터가 물리 피해의 (80-100)%를 추가 카오스 피해로 획득",
    engMod: "Monsters gain (80-100)% of their Physical Damage as Extra Chaos Damage",
    regex: "카.*피",
    engregex: "ra c",
    tier17: true
  },

  {
    No: 89,
    mod: "지역에 질식의 구체 등장",
    engMod: "Area contains Drowning Orbs",
    regex: "질",
    engregex: "wni",
    tier17: true
  },
  {
    No: 90,
    mod: "지역 내 희귀 몬스터가 쉐이퍼의 손길에 닿음",
    engMod: "Rare monsters in area are Shaper-Touched",
    regex: "쉐",
    engregex: "hap",
    tier17: true
  },

  {
    No: 91,
    mod: "지도 보스가 결합 보스 대동",
    engMod: "Map Boss is accompanied by a Synthesis Boss",
    regex: "대동",
    engregex: "yn",
    tier17: true
  },
  {
    No: 92,
    mod: "지역에 작열의 총주교의 룬 등장",
    engMod: "Area contains Runes of the Searing Exarch",
    regex: "룬",
    engregex: "rune",
    tier17: true
  },

  {
    No: 93,
    mod: "플레이어의 모든 저항 최대치 -20%",
    engMod: "Players have -20% to all maximum Resistances",
    regex: "항.최",
    engregex: "o al",
    tier17: true
  },
  {
    No: 94,
    mod: "몬스터의 치명타 확률 (650-700)% 증가<br>몬스터의 치명타 피해 배율 +(70-75)%",
    engMod: "Monsters have (650-700)% increased Critical Strike Chance<br>+(70-75)% to Monster Critical Strike Multiplier",
    regex: "배율",
    engregex: "lier",
    tier17: true
  },
  {
    No: 95,
    mod: "몬스터의 공격 명중 시 중독<br>몬스터의 모든 명중 피해가 중독 유발 가능<br>몬스터의 중독 지속시간 100% 증가",
    engMod: "Monsters Poison on Hit<br>All Damage from Monsters' Hits can Poison<br>Monsters have 100% increased Poison Duration",
    regex: "독.지",
    engregex: "' h",
    tier17: true
  },

  {
    No: 96,
    mod: "플레이어의 효과 범위 (25-30)% 감폭",
    engMod: "Players have (25-30)% less Area of Effect",
    regex: "플.*범",
    engregex: "ss are",
    tier17: true
  },
  {
    No: 97,
    mod: "몬스터가 치명타로 받는 추가 피해 (35-45)% 감소",
    engMod: "Monsters take (35–45)% reduced Extra Damage from Critical Strikes",
    regex: "는.추",
    engregex: "kes",
    tier17: true
  },

  {
    No: 98,
    mod: "몬스터 피해가 15%의 원소 저항 관통",
    engMod: "Monster Damage Penetrates 15% Elemental Resistances",
    regex: "관통",
    engregex: "net",
    tier17: true
  },
  {
    No: 99,
    mod: "플레이어가 최근 4초 이내에 스킬을 사용한 횟수 1회당<br>해당 플레이어의 동작 속도 3% 감소",
    engMod: "layers have 3% reduced Action Speed for each time they've used a Skill Recently",
    regex: "한.횟",
    engregex: "'v",
    tier17: true
  },
  {
    No: 100,
    mod: "지역에 불안정한 촉수 마귀 등장",
    engMod: "Area contains Unstable Tentacle Fiends",
    regex: "촉수",
    engregex: "tab",
    tier17: true
  },
  {
    No: 101,
    mod: "지역에 각성자의 비애 지대 존재",
    engMod: "Area has patches of Awakeners' Desolation",
    regex: "애",
    engregex: "wak",
    tier17: true
  },
  {
    No: 102,
    mod: "몬스터의 공격 피해 막기 확률 +50%",
    engMod: "Monsters have +50% Chance to Block Attack Damage",
    regex: "공.*막",
    engregex: "k at",
    tier17: true,
    currency: true
  },
  {
    No: 103,
    mod: "몬스터의 공격 피해 막기 확률 +50%",
    engMod: "Monsters have +50% Chance to Block Attack Damage",
    regex: "공.*막",
    engregex: "k at",
    tier17: true,
    currency: true
  },
  {
    No: 104,
    mod: "몬스터가 물리 피해의 20%를 반사<br>몬스터가 원소 피해의 20%를 반사",
    engMod: "Monsters reflect 20% of Physical Damage Monsters reflect 20% of Elemental Damage",
    regex: "몬.*반",
    engregex: "f ph",
    tier17: true,
    currency: true
  },
  {
    No: 105,
    mod: "몬스터의 생명력 (90-100)% 증폭",
    engMod: "(90-100)% more Monster Life",
    regex: "력.*증폭",
    engregex: "r li",
    tier17: true,
    currency: true
  },
  {
    No: 106,
    mod: "플레이어들이 피얼룩 톱날에 습격당함",
    engMod: "Players are assaulted by Bloodstained Sawblades",
    regex: "톱",
    engregex: "wb",
    tier17: true,
    currency: true
  },
  {
    No: 107,
    mod: "플레이어들이 희귀 또는 고유 몬스터 처치 후<br>10초 동안 죽음의 징표 획득",
    engMod: "Players are Marked for Death for 10 seconds<br>after killing a Rare or Unique monster",
    regex: "징",
    engregex: "rke",
    tier17: true,
    currency: true
  },
  {
    No: 108,
    mod: "희귀 및 고유 몬스터가 명중 시 생명력, 마나 및<br>에너지 보호막의 5% 제거",
    engMod: "Rare and Unique Monsters remove 5% of Life, Mana and Energy Shield from Players or their Minions on Hit",
    regex: "%.제",
    engregex: "na a",
    tier17: true,
    currency: true
  },
  {
    No: 109,
    mod: "몬스터의 공격이 명중 시 꿰뚫음<br>플레이어에게 다섯 번째 꿰뚫기가 유발되면 꿰뚫기가 제거되고<br>꿰뚫기의 물리 피해에 남은 명중 횟수를 곱한 만큼의 피해가<br>해당 플레이어 및 1.8미터 내의 동료들에게 반사됨",
    engMod: "Monsters' Attacks Impale on Hit When a fifth Impale is inflicted on a Player, Impales are removed to Reflect their Physical Damage multiplied by their remaining Hits to that Player and their Allies within 1.8 metres",
    regex: "곱",
    engRegex: "fif",
    tier17: true,
    currency: true
  },
  {
    No: 110,
    mod: "플레이어가 플라스크 사용 시 유성의 대상이 됨",
    engMod: "Players are targeted by a Meteor when they use a Flask",
    regex: "유성",
    engregex: "teo",
    tier17: true,
    currency: true
  },
  {
    No: 111,
    mod: "몬스터에게 적용되는 디버프가 100% 더 빠르게 만료됨",
    engMod: "Debuffs on Monsters expire 100% faster",
    regex: "몬.*디",
    engregex: "deb",
    tier17: true,
    currency: true
  },
  {
    No: 112,
    mod: "희귀 몬스터가 폭발성 중심부 보유",
    engMod: "Rare Monsters have Volatile Cores",
    regex: "성.중",
    engregex: "cores",
    tier17: true,
    scarab: true
  },
  {
    No: 113,
    mod: "몬스터가 주는 모든 피해가 점화, 동결, 감전 유발 가능<br>몬스터가 명중 시 점화, 동결, 감전 유발",
    engMod: "All Monster Damage can Ignite, Freeze and Shock<br>Monsters Ignite, Freeze and Shock on Hit",
    regex: "시.점",
    engregex: "hock$,",
    tier17: true,
    scarab: true
  },
  {
    No: 114,
    mod: "플레이어의 지뢰 투척 스킬이 지뢰를 1개 덜 투척<br>플레이어의 덫 투척 스킬이 덫을 1개 덜 투척",
    engMod: "Player Skills which Throw Mines throw 1 fewer Mine<br>Player Skills which Throw Traps throw 1 fewer Trap",
    regex: "뢰",
    engregex: "hro",
    tier17: true,
    scarab: true
  },
  {
    No: 115,
    mod: "플레이어들의 토템이 피격 시 받는 피해의 15%를<br>소환자의 생명력에 대신 적용",
    engMod: "15% of Damage Players' Totems take from Hits is taken from their Summoner's Life instead",
    regex: "대신",
    engregex: "oner",
    tier17: true,
    scarab: true
  },
  {
    No: 116,
    mod: "지역에 석화의 조각상 등장",
    engMod: "Area contains Petrification Statues",
    regex: "조각",
    engregex: "pet",
    tier17: true,
    scarab: true
  },

  {
    No: 117,
    mod: "플레이어의 방어력 (25~30)% 감폭",
    engMod: "Players have (25-30)% less Defences",
    regex: "어력.*감",
    engregex: "efe",
    tier17: true,
    scarab: true
  },
  {
    No: 118,
    mod: "플레이어들의 소환수의 공격 속도 50% 감폭<br>플레이어들의 소환수의 시전 속도 50% 감폭<br>플레이어들의 소환수의 이동 속도 50% 감폭",
    engMod: "Players' Minions have 50% less Attack Speed<br>Players' Minions have 50% less Cast Speed<br>Players' Minions have 50% less Movement Speed",
    regex: "들의.소",
    engregex: "' mi",
    tier17: true,
    scarab: true
  },
  {
    No: 119,
    mod: "플레이어에게 적용되는 버프가 100% 더 빠르게 만료됨",
    engMod: "Buffs on Players expire 100% faster",
    regex: "플.*빠",
    engregex: "n pl",
    tier17: true,
    scarab: true
  },
  {
    No: 120,
    mod: "플레이어가 취약성 저주에 걸림<br>플레이어가 시간의 사슬 저주에 걸림<br>플레이어가 원소 약화 저주에 걸림",
    engMod: "Players are Cursed with Vulnerability<br>Players are Cursed with Temporal Chains<br>Players are Cursed with Elemental Weakness",
    regex: "취",
    engregex: "vu",
    tier17: true,
    scarab: true
  },
  {
    No: 121,
    mod: "몬스터가 최대 생명력의 (70-80)%를<br>추가 에너지 보호막 최대치로 획득",
    engMod: "Monsters gain (70-80)% of Maximum Life as Extra Maximum Energy Shield",
    regex: "치로",
    engregex: "m li",
    tier17: true,
    map: true
  },
  {
    No: 122,
    mod: "몬스터의 주문 피해 억제 확률 +100%",
    engMod: "Monsters have +100% chance to Suppress Spell Damage",
    regex: "제.확",
    engregex: "o su",
    tier17: true,
    map: true
  },

  {
    No: 123,
    mod: "몬스터가 명중 시 탐욕스러운 덩굴 2개 유발",
    engMod: "Monsters inflict 2 Grasping Vines on Hit",
    regex: "탐욕",
    engregex: "pin",
    tier17: true,
    map: true
  },

  {
    No: 124,
    mod: "몬스터의 물리 피해 감소 +50%<br>몬스터의 카오스 저항 +35%<br>몬스터의 원소 저항 +55%",
    engMod: "+50% Monster Physical Damage Reduction<br>+35% Monster Chaos Resistance<br>+55% Monster Elemental Resistance",
    regex: "물.*감",
    engregex: "uct",
    tier17: true,
    map: true
  },
  {
    No: 125,
    mod: "몬스터의 권능 충전 최대치 +1<br>몬스터가 명중 시 권능 충전 획득",
    engMod: "Monsters have +1 to Maximum Power Charges<br>Monsters gain a Power Charge on Hit",
    regex: "의.권",
    engregex: "mum p",
    tier17: true,
    map: true
  },
  {
    No: 126,
    mod: "몬스터의 격분 충전 최대치 +1<br>몬스터가 명중 시 격분 충전 획득",
    engMod: "Monsters have +1 to Maximum Frenzy Charges<br>Monsters gain a Frenzy Charge on Hit",
    regex: "의.격",
    engregex: "mum f",
    tier17: true,
    map: true
  },
  {
    No: 127,
    mod: "몬스터의 인내 충전 최대치 +1<br>몬스터가 피격 시 인내 충전 획득",
    engMod: "Monsters have +1 to Maximum Endurance Charges<br>Monsters gain an Endurance Charge when hit",
    regex: "의.인",
    engregex: "m end",
    tier17: true,
    map: true
  },
  {
    No: 128,
    mod: "고유 몬스터가 무작위 성소 버프 1개 보유",
    engMod: "Unique Monsters have a random Shrine Buff",
    regex: "소.버",
    engregex: "ff$",
    tier17: true,
    map: true
  },
];


const nonTier17Mods = MapModList.filter(m => !m.tier17);
const tier17Mods = MapModList.filter(m => m.tier17);

const avoidModsSorted = [
  ...nonTier17Mods.slice().sort((a, b) => a.No - b.No),
  ...tier17Mods.slice().sort((a, b) => a.No - b.No),
];

const includeModsSorted = [
  ...nonTier17Mods.slice().sort((a, b) => b.No - a.No),
  ...tier17Mods.slice().sort((a, b) => a.No - b.No),
];

const darkRedIds = [1, 2, 3, 4, 5, 6, 7];
const mediumRedIds = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const GoldIds = [78, 79];

const rarityMapping = [
  { id: 'filter-rarity-normal', ko: '일반', en: 'n', order: 3 },
  { id: 'filter-rarity-magic', ko: '마법', en: 'm', order: 2 },
  { id: 'filter-rarity-rare', ko: '희귀', en: 'r', order: 1 }
];

const advancedOptionsConfig = [
  { value: 'quantity', ko: '아이템 수량', korKeyword: '량', engKeyword: 'm q' },
  { value: 'rarity', ko: '아이템 희귀도', korKeyword: '귀도', engKeyword: 'rity' },
  { value: 'packsize', ko: '몬스터 무리 규모', korKeyword: '모', engKeyword: 'iz' },
  { value: 'currency', ko: '화폐 더 많음', korKeyword: '화', engKeyword: 'urr' },
  { value: 'scarab', ko: '갑충석 더 많음', korKeyword: '갑', engKeyword: 'sca' },
  { value: 'map', ko: '지도 더 많음', korKeyword: '지도', engKeyword: 'map' }
];

import React, { useState, useEffect, useMemo, useRef } from 'react';
import './RegexGenerator.css';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';

const RegexGenerator = ({ lang }) => {
  const [iconUrls, setIconUrls] = useState({});
  const [ruleGroups, setRuleGroups] = useState([{ id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
  const [excludedMods, setExcludedMods] = useState([]);
  const [includedMods, setIncludedMods] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    'filter-tier16': true, 'filter-tier17': true,
    'filter-rarity-normal': true, 'filter-rarity-magic': true, 'filter-rarity-rare': true,
    'filter-corrupted-yes': false, 'filter-corrupted-no': false
  });
  const [searches, setSearches] = useState({ searchExclude: '', searchInclude: '' });
  const [openAccordions, setOpenAccordions] = useState({ basic: false, advanced: false });
  const [isCopied, setIsCopied] = useState(false);

  const advancedContentRef = useRef(null);
  const basicContentRef = useRef(null);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wp-json/asura/v1/ui-icons`);
        const data = await response.json();
        setIconUrls(data);
      } catch (error) {
      }
    };
    fetchIcons();
  }, []);

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem('regexGeneratorState');
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        setRuleGroups(savedState.ruleGroups || [{ id: Date.now(), conditions: [] }]);
        setExcludedMods(savedState.excludedMods || []);
        setIncludedMods(savedState.includedMods || []);
        setCheckboxes(savedState.checkboxes || {});
      }
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    const stateToSave = { ruleGroups, excludedMods, includedMods, checkboxes };
    localStorage.setItem('regexGeneratorState', JSON.stringify(stateToSave));
  }, [ruleGroups, excludedMods, includedMods, checkboxes]);

  useEffect(() => {
    if (openAccordions.advanced && advancedContentRef.current) {
      advancedContentRef.current.style.maxHeight = `${advancedContentRef.current.scrollHeight}px`;
    }
  }, [ruleGroups, openAccordions.advanced]);

  const handleCheckboxChange = (id) => {
    setCheckboxes(prev => {
      const newCheckboxes = { ...prev, [id]: !prev[id] };
      if (id === 'filter-corrupted-yes' && newCheckboxes[id]) newCheckboxes['filter-corrupted-no'] = false;
      if (id === 'filter-corrupted-no' && newCheckboxes[id]) newCheckboxes['filter-corrupted-yes'] = false;
      return newCheckboxes;
    });
  };

  const handleModClick = (mod, type) => {
    const updater = type === 'excluded' ? setExcludedMods : setIncludedMods;
    updater(prev => prev.includes(mod.mod) ? prev.filter(m => m !== mod.mod) : [...prev, mod.mod]);
  };

  const handleReset = () => {
    localStorage.removeItem('regexGeneratorState');
    setRuleGroups([{ id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
    setExcludedMods([]);
    setIncludedMods([]);
    setCheckboxes({
      'filter-tier16': true, 'filter-tier17': true,
      'filter-rarity-normal': true, 'filter-rarity-magic': true, 'filter-rarity-rare': true,
      'filter-corrupted-yes': false, 'filter-corrupted-no': false
    });
    setSearches({ searchExclude: '', searchInclude: '' });
    setOpenAccordions({ basic: false, advanced: false });
  };

  const generateMinNumberRegex = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 10 || num >= 1000) return '';
    const numStr = String(num);
    const len = numStr.length;
    const parts = [];
    for (let i = 0; i < len; i++) {
      const prefix = numStr.substring(0, i);
      const currentDigit = parseInt(numStr[i], 10);
      if (i === len - 1) {
        if (currentDigit <= 9) parts.push(`${prefix}[${currentDigit}-9]`);
      } else {
        if (currentDigit < 9) {
          const higherRange = `[${currentDigit + 1}-9]`;
          const remaining = `\\d{${len - 1 - i}}`;
          parts.push(`${prefix}${higherRange}${remaining}`);
        }
      }
    }
    if (len === 2) parts.push(`\\d{3}`);
    return `(${parts.reverse().join('|')})`;
  };


  const regexOutput = useMemo(() => {
    const isKo = lang === 'ko';
    let parts = [];

    const getRegexText = (cond) => {
      if (!cond || !cond.type || !cond.value) return null;
      const config = advancedOptionsConfig.find(c => c.value === cond.type);
      const numPattern = generateMinNumberRegex(cond.value);
      if (!config || !numPattern) return null;
      return { text: `${isKo ? config.korKeyword : config.engKeyword}.*${numPattern}%`, cond: cond };
    };

    const optimizeAndBuildClause = (conditions) => {
      const bestConditions = new Map();
      for (const cond of conditions) {
        if (!bestConditions.has(cond.type) || Number(cond.value) < Number(bestConditions.get(cond.type).value)) {
          bestConditions.set(cond.type, cond);
        }
      }
      const regexTexts = Array.from(bestConditions.values()).map(c => getRegexText(c).text);
      return `"${regexTexts.join('|')}"`;
    };
    const excludedModRegex = excludedMods.map(modText => MapModList.find(m => m.mod === modText)?.[isKo ? 'regex' : 'engregex']).filter(Boolean);
    if (excludedModRegex.length > 0) parts.push(`"!${excludedModRegex.join('|')}"`);

    const includedModRegex = includedMods.map(modText => MapModList.find(m => m.mod === modText)?.[isKo ? 'regex' : 'engregex']).filter(Boolean).join(' ');
    if (includedModRegex) parts.push(includedModRegex);

    const ruleGroupsData = ruleGroups.map(group => group.conditions.map(getRegexText).filter(Boolean)).filter(group => group.length > 0);
    let finalGroupRegex = '';

    if (ruleGroupsData.length === 1) {
      finalGroupRegex = ruleGroupsData[0].map(item => `"${item.text}"`).join(' ');
    } else if (ruleGroupsData.length > 1) {
      const andGroups = ruleGroupsData.filter(g => g.length > 1);
      const orGroups = ruleGroupsData.filter(g => g.length === 1);

      if (andGroups.length > 1) {
        finalGroupRegex = isKo ? '"POE 검색 엔진의 한계로 인해, 2개 이상의 조건 그룹(AND)을 OR로 연결하는 복합 검색은 생성할 수 없습니다"' : '"Due to a limitation of the POE search engine, a complex query connecting more than one AND-group with an OR cannot be created."';
      } else if (andGroups.length === 1) {
        const andConditions = andGroups[0].map(item => item.cond);
        const orConditions = orGroups.flat().map(item => item.cond);

        const newClauses = andConditions.map(andCond => {
          const combined = [andCond, ...orConditions];
          return optimizeAndBuildClause(combined);
        });
        finalGroupRegex = newClauses.join(' ');
      } else {
        const allConditions = ruleGroupsData.flat().map(item => item.cond);
        finalGroupRegex = optimizeAndBuildClause(allConditions);
      }
    }

    if (finalGroupRegex) {
      parts.push(finalGroupRegex);
    }

    const checkedRarities = rarityMapping.filter(r => checkboxes[r.id]);
    if (checkedRarities.length > 0 && checkedRarities.length < rarityMapping.length) {
      const values = checkedRarities.map(r => r[isKo ? 'ko' : 'en']).join('|');
      parts.push(isKo ? `"희귀도: ${values}"` : `"y:(${values})"`);
    }

    if (checkboxes['filter-corrupted-yes'] && !checkboxes['filter-corrupted-no']) parts.push(isKo ? '타락' : 'pte');
    else if (checkboxes['filter-corrupted-no'] && !checkboxes['filter-corrupted-yes']) parts.push(isKo ? '!타락' : '!pte');

    return parts.join(' ').trim();
  }, [excludedMods, includedMods, ruleGroups, checkboxes, lang]);


  const copyToClipboard = () => {
    if (isCopied) return;

    navigator.clipboard.writeText(regexOutput).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
  };

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addRuleGroup = () => setRuleGroups(prev => [...prev, { id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
  const deleteRuleGroup = (id) => setRuleGroups(prev => prev.length > 1 ? prev.filter(g => g.id !== id) : prev);
  const addCondition = (id) => setRuleGroups(prev => prev.map(g => g.id === id ? { ...g, conditions: [...g.conditions, { type: 'quantity', value: '' }] } : g));
  const deleteCondition = (id, condIndex) => setRuleGroups(prev => prev.map(g => g.id === id ? { ...g, conditions: g.conditions.filter((_, i) => i !== condIndex) } : g));
  const updateCondition = (id, condIndex, field, value) => setRuleGroups(prev => prev.map(g => g.id === id ? { ...g, conditions: g.conditions.map((c, i) => i === condIndex ? { ...c, [field]: value } : c) } : g));

  const ModButton = ({ mod, type, iconUrls }) => {
    const isSelected = (type === 'excluded' ? excludedMods : includedMods).includes(mod.mod);
    const classNames = ['mod-btn'];
    if (isSelected) classNames.push('selected');
    if (mod.tier17) classNames.push('mod-purple');
    else if (darkRedIds.includes(mod.No)) classNames.push('mod-dark-red');
    else if (mediumRedIds.includes(mod.No)) classNames.push('mod-medium-red');
    else if (GoldIds.includes(mod.No)) classNames.push('mod-gold');

    return (
      <button className={classNames.join(' ')} onClick={() => handleModClick(mod, type)}>
        <span className="mod-text" dangerouslySetInnerHTML={{ __html: lang === 'ko' ? mod.mod : mod.engMod }}></span>
        {(mod.currency || mod.scarab || mod.map) && (
          <div className="icon-wrapper">
            {mod.currency && iconUrls.divine && <img src={iconUrls.divine} className="mod-icon" alt="화폐" />}
            {mod.scarab && iconUrls.Horned_Scarab_of_Awakening_inventory_icon && <img src={iconUrls.Horned_Scarab_of_Awakening_inventory_icon} className="mod-icon" alt="갑충석" />}
            {mod.map && iconUrls.summit_map && <img src={iconUrls.summit_map} className="mod-icon" alt="지도" />}
          </div>
        )}
      </button>
    );
  };

  const createSortedModList = (baseList, selectedList, searchTerm) => {
    const filtered = baseList.filter(m => {
      const isTierMatch = (checkboxes['filter-tier16'] && !m.tier17) || (checkboxes['filter-tier17'] && m.tier17);
      return isTierMatch && (lang === 'ko' ? m.mod : m.engMod).toLowerCase().includes(searchTerm.toLowerCase());
    });
    const selected = filtered.filter(m => selectedList.includes(m.mod));
    const unselected = filtered.filter(m => !selectedList.includes(m.mod));
    return [...selected, ...unselected];
  };

  const filteredAvoidMods = useMemo(() => createSortedModList(avoidModsSorted, excludedMods, searches.searchExclude), [searches.searchExclude, checkboxes, lang, excludedMods]);
  const filteredIncludeMods = useMemo(() => createSortedModList(includeModsSorted, includedMods, searches.searchInclude), [searches.searchInclude, checkboxes, lang, includedMods]);

  return (
    <div id="regex" className="section">
      <div className="container">
        <Breadcrumbs lang={lang} />
        <h1>{lang === 'ko' ? 'Path of Exile\n정규식 생성기' : 'Path of Exile\nRegex Generator'}</h1>
        <p>{lang === 'ko' ? '맵 모드를 클릭해 정규식을 생성하세요' : 'Click map mods to generate a regex string'}</p>
        <div id="regex-fixed-container">
          <textarea id="regexOutputFinal" value={regexOutput} readOnly />
          <div className="regex-output-footer">
            <div id="regex-char-counter-container">
              <span id="regexCharCounter" style={{ color: regexOutput.length > 250 ? '#e53935' : 'inherit' }}>{regexOutput.length}/250</span>
            </div>
            <div className="regex-buttons-wrapper">
              <button
                id="copyRegexButton"
                onClick={copyToClipboard}
                className={isCopied ? 'copied' : ''}
              >
                {isCopied
                  ? (lang === 'ko' ? '복사 완료!' : 'Copied!')
                  : (lang === 'ko' ? '복사' : 'Copy')}
              </button>
              <button id="resetRegexButton" onClick={handleReset}>{lang === 'ko' ? '초기화' : 'Reset'}</button>
            </div>
          </div>
        </div>
        <div className="filter-accordions-wrapper">
          <div className="accordion-container">
            <button className={`accordion-toggle ${openAccordions.advanced ? 'active' : ''}`} onClick={() => toggleAccordion('advanced')}>{lang === 'ko' ? '고급 옵션' : 'Advanced Options'}</button>
            <div ref={advancedContentRef} className="accordion-content" style={{ maxHeight: openAccordions.advanced ? `${advancedContentRef.current?.scrollHeight}px` : '0px' }}>
              <div id="rule-builder-area">
                {ruleGroups.map((group, groupIndex) => (
                  <React.Fragment key={group.id}>
                    <div className="rule-group">
                      <div className="rule-group-header">
                        <strong className="rule-group-title">{lang === 'ko' ? `그룹 ${groupIndex + 1}` : `Group ${groupIndex + 1}`}</strong>
                        {ruleGroups.length > 1 && <button className="delete-group-button" onClick={() => deleteRuleGroup(group.id)}>{lang === 'ko' ? '삭제' : 'Del'}</button>}
                      </div>
                      {group.conditions.map((cond, condIndex) => (
                        <div className="condition-row" key={condIndex}>
                          <select className="condition-type" value={cond.type} onChange={(e) => updateCondition(group.id, condIndex, 'type', e.target.value)}>{advancedOptionsConfig.map(opt => <option key={opt.value} value={opt.value}>{lang === 'ko' ? opt.ko : opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}</option>)}</select>
                          <input type="number" className="condition-value" placeholder="Minimum (%)" value={cond.value} onChange={(e) => updateCondition(group.id, condIndex, 'value', e.target.value)} />
                          <button className="delete-condition-button" onClick={() => deleteCondition(group.id, condIndex)}>×</button>
                        </div>
                      ))}
                      <div className="rule-group-footer"><button className="add-condition-button" onClick={() => addCondition(group.id)}>{lang === 'ko' ? '+ 조건 추가' : '+ Add Condition'}</button></div>
                    </div>
                    {groupIndex < ruleGroups.length - 1 && <div className="rule-separator"><span>OR</span></div>}
                  </React.Fragment>
                ))}
              </div>
              <button id="add-rule-group-button" onClick={addRuleGroup}>{lang === 'ko' ? 'OR 조건 그룹 추가' : 'Add OR Condition Group'}</button>
            </div>
          </div>
          <div className="accordion-container">
            <button className={`accordion-toggle ${openAccordions.basic ? 'active' : ''}`} onClick={() => toggleAccordion('basic')}>{lang === 'ko' ? '기본 옵션' : 'Basic Options'}</button>
            <div ref={basicContentRef} className="accordion-content" style={{ maxHeight: openAccordions.basic ? `${basicContentRef.current?.scrollHeight}px` : '0px' }}>
              <div id="basic-options-content">
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '티어:' : 'Tier:'}</span>
                  <label className="filter-label" htmlFor="filter-tier16">
                    <input type="checkbox" id="filter-tier16" checked={checkboxes['filter-tier16']} onChange={() => handleCheckboxChange('filter-tier16')} />
                    <span className="label-text">{lang === 'ko' ? '16티어 모드' : 'T16 MOD'}</span>
                  </label>
                  <label className="filter-label" htmlFor="filter-tier17">
                    <input type="checkbox" id="filter-tier17" checked={checkboxes['filter-tier17']} onChange={() => handleCheckboxChange('filter-tier17')} />
                    <span className="label-text">{lang === 'ko' ? '17티어 모드' : 'T17 MOD'}</span>
                  </label>
                </div>
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '희귀도:' : 'Rarity:'}</span>
                  <label className="filter-label" htmlFor="filter-rarity-normal">
                    <input type="checkbox" id="filter-rarity-normal" checked={checkboxes['filter-rarity-normal']} onChange={() => handleCheckboxChange('filter-rarity-normal')} />
                    <span className="label-text">{lang === 'ko' ? '일반' : 'Normal'}</span>
                  </label>
                  <label className="filter-label" htmlFor="filter-rarity-magic">
                    <input type="checkbox" id="filter-rarity-magic" checked={checkboxes['filter-rarity-magic']} onChange={() => handleCheckboxChange('filter-rarity-magic')} />
                    <span className="label-text">{lang === 'ko' ? '마법' : 'Magic'}</span>
                  </label>
                  <label className="filter-label" htmlFor="filter-rarity-rare">
                    <input type="checkbox" id="filter-rarity-rare" checked={checkboxes['filter-rarity-rare']} onChange={() => handleCheckboxChange('filter-rarity-rare')} />
                    <span className="label-text">{lang === 'ko' ? '희귀' : 'Rare'}</span>
                  </label>
                </div>
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '타락:' : 'Corrupted:'}</span>
                  <label className="filter-label" htmlFor="filter-corrupted-yes">
                    <input type="checkbox" id="filter-corrupted-yes" checked={checkboxes['filter-corrupted-yes']} onChange={() => handleCheckboxChange('filter-corrupted-yes')} />
                    <span className="label-text">Yes</span>
                  </label>
                  <label className="filter-label" htmlFor="filter-corrupted-no">
                    <input type="checkbox" id="filter-corrupted-no" checked={checkboxes['filter-corrupted-no']} onChange={() => handleCheckboxChange('filter-corrupted-no')} />
                    <span className="label-text">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="mod-area">
          <div className="option-group">
            <h3>{lang === 'ko' ? '❌제외할 모드' : '❌Mods to Exclude'}</h3>
            <input type="text" className="mod-search" placeholder="Search..." value={searches.searchExclude} onChange={e => setSearches({ ...searches, searchExclude: e.target.value })} />
            <div id="mod-list-bad">{filteredAvoidMods.map(mod => <ModButton key={`exclude-${mod.No}`} mod={mod} type="excluded" iconUrls={iconUrls} />)}</div>
          </div>
          <div className="option-group">
            <h3>{lang === 'ko' ? '✅포함할 모드' : '✅Mods to Include'}</h3>
            <input type="text" className="mod-search" placeholder="Search..." value={searches.searchInclude} onChange={e => setSearches({ ...searches, searchInclude: e.g.target.value })} />
            <div id="mod-list-good">{filteredIncludeMods.map(mod => <ModButton key={`include-${mod.No}`} mod={mod} type="included" iconUrls={iconUrls} />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexGenerator;