# Mock data 생성기

## 사용법
- JSON field에 원하는 json을 입력.
- Model filed에 원하는 모델을 설정.
- JSON field와 Model field는 Model을 참조하여 데이터를 만들 수 있다.

## 예시
*JSON field*
```json
{
  "id": 1,
  "created_at": RANDOM_DATE(),
  "updated_at": RANDOM_DATE(),
  "dms": DM(4)
}
```
*Model field*<br/>
**model name을 입력해주세요.**
```json
model name - DM

{
  "id": RANDOM_STRING(12),
  "created_at": RANDOM_DATE(),
  "updated_at": RANDOM_DATE(),
  "text": RANDOM_STRING()
}
```
*result*
```json
{
  "id": 1,
  "created_at": "2021-03-27T02:15:38.124Z",
  "updated_at": "2021-03-26T09:00:01.035Z",
  "dms": [
    {
      "id": "QrIh2gxzDuwa",
      "created_at": "2021-03-26T08:23:59.825Z",
      "updated_at": "2021-03-28T21:47:26.519Z",
      "text": "77fITr9xMLE0"
    },
    {
      "id": "WaAD9hH1y_WK",
      "created_at": "2021-04-01T18:16:21.238Z",
      "updated_at": "2021-03-29T17:19:01.019Z",
      "text": "kY5arBzgn9I-"
    },
    {
      "id": "4nxu4Jo4xxPP",
      "created_at": "2021-04-05T03:37:28.888Z",
      "updated_at": "2021-04-05T05:56:50.613Z",
      "text": "_CerqfHP2cNA"
    },
    {
      "id": "7tt-Jm6KQxrp",
      "created_at": "2021-03-28T05:00:18.729Z",
      "updated_at": "2021-03-31T15:44:12.906Z",
      "text": "QGcgbJ1zlan-"
    }
  ]
}
```

## API
- DEFAULT API
  - RANDOM_STRING(value: number = 12): 랜덤한 스트링을 nanoid 라이브러리를 사용해  생성해준다. 기본값은 12이다.
  - RANDOM_NUMBER(value: number = 10): 랜덤한 숫자를 생성해준다. 기본값은 10이다.
  - RANDOM_DATE(value: number = -7): 랜덤한 날짜를 생성해준다. 오늘 날짜를 기준으로 value값만큼 이전의 날짜를 지정할 수 있다. ex) -7이면 오늘부터 일주일 전의 날짜중 아무거나 랜덤으로 생성. 기본값은 -7이다.
- CUSTOM_MODEL(value: number = 0): 자신이 모델을 정의하여 사용할 수 있다. 괄호 안의 value를 1이상 지정한다면 배열의 형태로 리턴된다. 괄호안의 value를 넣지 않거나 0을 기입하면 객체 하나만 리턴한다.

## ❗️주의
간단한 mock data생성기로 심심치 않게 오류가 날 수 있습니다. 따라서 아래의 JSON format을 **완벽히** 기입하셔야 사용 사능합니다.
- key값은 double qoute(")로 반드시 감싸주세요.
- 마지막 value 값은 (,)을 빼고 기입해 주세요
- 이외에도 json format을 따라 작성해 주세요.
- 동일한 Model name을 사용하지 마세요.
- 해당 모델이 자기 자신을 참조하지 마세요.
- 순환참조를 하지 마세요.

## parsing 원리
정규 표현식과 javascript string.prototype.replace를 사용하여 JSON field와 Model field를 파싱합니다. ex) `(...someJson).replace(/RANDOM_STRING\(\)/, ...callback)`<br />
따라서 동일한 이름의 Model이 생기거나 자기 자신을 참조, 혹은 순환참조를 하게 된다면 예상하지 못한 동작이 발생 할 수 있습니다.
