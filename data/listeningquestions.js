const listeningQuestions = [
    {
      question: '다음을 듣고 <보기>와 같이 물음에 맞는 대답을 고르십시오.\n가: 책을 읽어요?\n나: ______________________',
      audio: 'listening.mp3',
      options: [
        { id: 1, text: '① 네, 책이 없어요.' },
        { id: 2, text: '② 네, 책을 읽어요.' },
        { id: 3, text: '③ 아니요, 책이 많아요.' },
        { id: 4, text: '④ 아니요, 책을 좋아해요.' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음을 듣고 <보기>와 같이 물음에 맞는 대답을 고르십시오.\n가: 구두가 커요?\n나: ______________________',
      audio: 'listening1.mp3',
      options: [
        { id: 1, text: '① 네, 구두예요.' },
        { id: 2, text: '② 네, 구두가 예뻐요.' },
        { id: 3, text: '③ 아니요, 구두가 작아요.' },
        { id: 4, text: '④ 아니요, 구두가 있어요.' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음을 듣고 <보기>와 같이 물음에 맞는 대답을 고르십시오.\n가: 지금 뭐 먹어요?\n나: ______________________',
      audio: 'listening2.mp3',
      options: [
        { id: 1, text: '① 자주 먹어요.' },
        { id: 2, text: '② 집에서 먹어요.' },
        { id: 3, text: '③ 김밥을 먹어요.' },
        { id: 4, text: '④ 언니하고 먹어요.' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음을 듣고 <보기>와 같이 이어지는 말을 고르십시오.\n남자: 수미 씨, 연필 좀 주세요.\n여자: ______________________',
      audio: 'listening3.mp3',
      options: [
        { id: 1, text: '① 괜찮아요.' },
        { id: 2, text: '② 반가워요.' },
        { id: 3, text: '③ 여기 있어요.' },
        { id: 4, text: '④ 잘 지냈어요.' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음을 듣고 <보기>와 같이 이어지는 말을 고르십시오.\n여자: 오늘 도와줘서 고마웠어요.\n남자: ______________________',
      audio: 'listening4.mp3',
      options: [
        { id: 1, text: '① 미안해요.' },
        { id: 2, text: '② 아니에요.' },
        { id: 3, text: '③ 부탁해요.' },
        { id: 4, text: '④ 좋겠어요.' },
      ],
      correctAnswer: 2,
    },
    {
      question: '여기는 어디입니까? <보기>와 같이 알맞은 것을 고르십시오.\n여자: 뭘 드릴까요?\n남자: 장미가 예쁘네요. 장미 주세요.',
      audio: 'listening5.mp3',
      options: [
        { id: 1, text: '① 꽃집' },
        { id: 2, text: '② 식당' },
        { id: 3, text: '③ 교실' },
        { id: 4, text: '④ 약국' },
      ],
      correctAnswer: 1,
    },
    {
      question: '여기는 어디입니까? <보기>와 같이 알맞은 것을 고르십시오.\n남자: 어서 오세요, 손님. 어디까지 가세요?\n여자: 한국대학교로 가 주세요.',
      audio: 'listening6.mp3',
      options: [
        { id: 1, text: '① 공항' },
        { id: 2, text: '② 택시' },
        { id: 3, text: '③ 우체국' },
        { id: 4, text: '④ 백화점' },
      ],
      correctAnswer: 2,
    },
    {
      question: '여기는 어디입니까? <보기>와 같이 알맞은 것을 고르십시오.\n여자: 방은 5층이고, 501호입니다.\n남자: 네. 아침 식사 시간은 언제예요?',
      audio: 'listening7.mp3',
      options: [
        { id: 1, text: '① 호텔' },
        { id: 2, text: '② 회사' },
        { id: 3, text: '③ 극장' },
        { id: 4, text: '④ 빵집' },
      ],
      correctAnswer: 1,
    },
    {
      question: '여기는 어디입니까? <보기>와 같이 알맞은 것을 고르십시오.\n남자: 저 여기 산책하러 자주 오는데 참 좋지요?\n여자: 네. 나무도 많고 넓어서 좋네요.',
      audio: 'listening8.mp3',
      options: [
        { id: 1, text: '① 서점' },
        { id: 2, text: '② 공원' },
        { id: 3, text: '③ 사진관' },
        { id: 4, text: '④ 미용실' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음은 무엇에 대해 말하고 있습니까? <보기>와 같이 알맞은 것을 고르십시오.\n남자: 아주머니 이 음식 매워요?\n여자: 네. 조금 매워요.',
      audio: 'listening9.mp3',
      options: [
        { id: 1, text: '① 일' },
        { id: 2, text: '② 맛' },
        { id: 3, text: '③ 시간' },
        { id: 4, text: '④ 이름' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음은 무엇에 대해 말하고 있습니까? <보기>와 같이 알맞은 것을 고르십시오.\n여자: 민수 씨, 야구를 좋아해요?\n남자: 아니요. 저는 축구가 좋아요.',
      audio: 'listening10.mp3',
      options: [
        { id: 1, text: '① 나라' },
        { id: 2, text: '② 장소' },
        { id: 3, text: '③ 날짜' },
        { id: 4, text: '④ 운동' },
      ],
      correctAnswer: 4,
    },
    {
      question: '다음은 무엇에 대해 말하고 있습니까? <보기>와 같이 알맞은 것을 고르십시오.\n남자: 저는 방학 때 제주도에 갈 거예요. 수미 씨는요?\n여자: 저는 고향에 갈 거예요.',
      audio: 'listening11.mp3',
      options: [
        { id: 1, text: '① 계획' },
        { id: 2, text: '② 날씨' },
        { id: 3, text: '③ 주말' },
        { id: 4, text: '④ 취미' },
      ],
      correctAnswer: 1,
    },
    {
      question: '다음은 무엇에 대해 말하고 있습니까? <보기>와 같이 알맞은 것을 고르십시오.\n여자: 저, 행복마트가 어디에 있어요?\n남자: 저기 은행 있지요? 은행 뒤로 가세요.',
      audio: 'listening12.mp3',
      options: [
        { id: 1, text: '① 약속' },
        { id: 2, text: '② 교통' },
        { id: 3, text: '③ 위치' },
        { id: 4, text: '④ 소개' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음 대화를 듣고 알맞은 그림을 고르십시오.',
      image: require('../assets/audioimages/question3.jpg'),
      audio: 'listening13.mp3',
      options: [
        { id: 1, text: '①' },
        { id: 2, text: '②' },
        { id: 3, text: '③' },
        { id: 4, text: '④' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음 대화를 듣고 알맞은 그림을 고르십시오.',
      image: require('../assets/audioimages/question4.jpg'),
      audio: 'listening14.mp3',
      options: [
        { id: 1, text: '①' },
        { id: 2, text: '②' },
        { id: 3, text: '③' },
        { id: 4, text: '④' },
      ],
      correctAnswer: 1,
    },
    {
      question: '다음을 듣고 <보기>와 같이 대화 내용과 같은 것을 고르십시오.',
      audio: 'listening15.mp3',
      options: [
        { id: 1, text: '① 남자는 출장을 갑니다.' },
        { id: 2, text: '② 여자는 아침에 출발합니다.' },
        { id: 3, text: '③ 여자는 내일 회사에 안 갑니다.' },
        { id: 4, text: '④ 남자는 내일 여자를 만날 겁니다.' },
      ],
      correctAnswer: 4,
    },
    {
      question: '다음을 듣고 <보기>와 같이 대화 내용과 같은 것을 고르십시오.',
      audio: 'listening16.mp3',
      options: [
        { id: 1, text: '① 여자는 식빵을 못 샀습니다.' },
        { id: 2, text: '② 남자는 여자에게 빵을 줬습니다.' },
        { id: 3, text: '③ 여자는 이 곳에 세 시에 왔습니다.' },
        { id: 4, text: '④ 남자는 지금 빵집에 다녀올 겁니다.' },
      ],
      correctAnswer: 1,
    },
    {
      question: '다음을 듣고 <보기>와 같이 대화 내용과 같은 것을 고르십시오.',
      audio: 'listening17.mp3',
      options: [
        { id: 1, text: '① 남자는 혼자 결혼식에 갈 겁니다.' },
        { id: 2, text: '② 여자는 일곱 시에 남자를 만날 겁니다.' },
        { id: 3, text: '③ 여자는 지하철로 결혼식장에 갈 겁니다.' },
        { id: 4, text: '④ 남자는 결혼식에 차를 가지고 갈 겁니다.' },
      ],
      correctAnswer: 3,
    },
    {
      question: '다음을 듣고 <보기>와 같이 대화 내용과 같은 것을 고르십시오.',
      audio: 'listening18.mp3',
      options: [
        { id: 1, text: '① 남자는 지금 카드가 없습니다.' },
        { id: 2, text: '② 남자는 인터넷으로 예약했습니다.' },
        { id: 3, text: '③ 여자는 이 식당에 처음 왔습니다.' },
        { id: 4, text: '④ 여자는 남자와 같이 식사를 했습니다.' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음을 듣고 <보기>와 같이 대화 내용과 같은 것을 고르십시오.',
      audio: 'listening19.mp3',
      options: [
        { id: 1, text: '① 여자는 남자와 같은 일을 합니다.' },
        { id: 2, text: '② 여자는 박물관에서 일하고 있습니다.' },
        { id: 3, text: '③ 남자는 박물관에서 일을 해 봤습니다.' },
        { id: 4, text: '④ 남자는 아르바이트를 안 하려고 합니다.' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음을 듣고 여자의 중심 생각을 고르십시오.',
      audio: 'listening20.mp3',
      options: [
        { id: 1, text: '① 재미있는 영화를 보고 싶습니다.' },
        { id: 2, text: '② 영화는 여러 번 봐도 재미있습니다.' },
        { id: 3, text: '③ 이 영화는 많은 사람이 봐야 합니다.' },
        { id: 4, text: '④ 이 영화는 영화관에서 보는 게 좋습니다.' },
      ],
      correctAnswer: 4,
    },
    {
      question: '다음을 듣고 여자의 중심 생각을 고르십시오.',
      audio: 'listening21.mp3',
      options: [
        { id: 1, text: '① 반이 더 많아져야 합니다.' },
        { id: 2, text: '② 쉬운 수업을 듣고 싶습니다.' },
        { id: 3, text: '③ 수업을 더 듣는 것이 좋습니다.' },
        { id: 4, text: '④ 영어 수업이 많이 도움이 됩니다.' },
      ],
      correctAnswer: 2,
    },
    {
      question: '다음을 듣고 여자의 중심 생각을 고르십시오.',
      audio: 'listening22.mp3',
      options: [
        { id: 1, text: '① 쓰레기를 모아서 버려야 합니다.' },
        { id: 2, text: '② 물건을 많이 살 필요가 없습니다.' },
        { id: 3, text: '③ 쓰레기를 버리는 곳이 많이 필요합니다.' },
        { id: 4, text: '④ 환경 보호에 관심을 가져야 합니다.' }
      ],
      correctAnswer: 2,
    },
    {
      question: '여자가 왜 이 이야기를 하고 있는지 고르십시오.',
      audio: 'listening23.mp3',
      options: [
        { id: 1, text: '① 신청을 더 받으려고' },
        { id: 2, text: '② 신청 방법이 바뀌어서' },
        { id: 3, text: '③ 대회 내용을 설명하려고' },
        { id: 4, text: '④ 대회 날짜를 알려 주려고' },
      ],
      correctAnswer: 1,
    },
    {
      question: '들은 내용과 같은 것을 고르십시오.',
      audio: 'listening24.mp3',
      options: [
        { id: 1, text: '① 이 대회는 이번 달에 합니다.' },
        { id: 2, text: '② 홈페이지에 대회 내용이 없습니다.' },
        { id: 3, text: '③ 금요일까지 참가 신청을 할 수 있습니다.' },
        { id: 4, text: '④ 이 대회에 참가 신청을 한 사람이 많습니다.' }
      ],
      correctAnswer: 3,
    },
    {
      question: '두 사람이 무엇에 대해 이야기를 하고 있는지 고르십시오.',
      audio: 'listening25.mp3',
      options: [
        { id: 1, text: '① 인기 있는 드라마' },
        { id: 2, text: '② 기억에 남는 여행' },
        { id: 3, text: '③ 원하는 휴가 기간' },
        { id: 4, text: '④ 드라마에 나온 장소' }
      ],
      correctAnswer: 4,
    },
    {
      question: '들은 내용과 같은 것을 고르십시오.',
      audio: 'listening26.mp3',
      options: [
        { id: 1, text: '① 남자는 요즘 주로 산을 그립니다.' },
        { id: 2, text: '② 남자는 어릴 때부터 그림을 배웠습니다.' },
        { id: 3, text: '③ 남자는 그림 전시회를 한 적이 있습니다.' },
        { id: 4, text: '④ 남자는 다른 사람과 함께 전시회를 합니다.' },
      ],
      correctAnswer: 4,
    },
];

export default listeningQuestions;
