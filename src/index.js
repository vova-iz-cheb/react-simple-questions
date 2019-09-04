import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

// note: if you will add a new question wont forget add correct answer in array CORRECT_ANSWER.
const QUESTIONS = [
  {
    question: "Самое большое космическое тело в солнечной системе?",
    variants: ["Земля", "Луна", "Солнце", "Сатурн"],
  },
  {
    question: "Планета, расположенная ближе всех к Солнцу?",
    variants: ["Плутон", "Меркурий", "Венера", "Марс"],
  },
  {
    question: "Бог войны в Древнем Риме?",
    variants: ["Уран", "Нептун", "Марс", "Сатурн"],
  },
  {
    question: "Приблизительная скорость света?",
    variants: ["300000км/сек", "300000км/мин", "300км/сек", "30000км/час"],
  },
  {
    question: "Плутон это планета?",
    variants: ["Нет", "Да"],
  },
  {
    question: "Планета, которая имеет самое внушительное кольцо?",
    variants: ["Юпитер", "Уран", "Сатурн", "Нептун"],
  },
  {
    question: "Планеты вражающиеся по часовой стрелке?",
    variants: ["Венера и Нептун", "Уран и Меркурий", "Меркурий и Сатурн", "Венера и Уран"],
  },
  {
    question: "Спутником какой планеты является Европа?",
    variants: ["Марс", "Нептун", "Сатурн", "Юпитер"],
  },
  {
    question: "Преобладающий элемент в составе Солнца?",
    variants: ["Гелий", "Кислород", "Водород", "Железо"],
  },
  {
    question: "Возраст земли?",
    variants: ["4.5 миллиарда лет", "9 миллиарда лет", "7 тысяч лет", "230 миллионов лет"],
  },
];

const CORRECT_ANSWER = [2,1,2,0,0,2,3,3,2,0];

const RESULT = {
  '100': 'Великолепно.',
  '80': 'Очень хорошо, продолжай в таком же духе.',
  '60': 'Вы бы могли лучше. Старайтесь и у вас все получится.',
  '40': 'Вам следует подучить материал.',
  '20': 'Ужасно.',
  '0': 'Хочется верить, что вы случайно нажали проверить.',
}

function Question(props) {
  let i = props.item;
  return (
    <div className="questions__item">
      <h3>{i.question}</h3>
      {i.variants.map(function(item, index) {
        return (
          <label key={index} className={props.disabled ? 'disabled' : false}>
              <input type="radio" value={index} name={`question#${props.index}`} 
                checked={index === props.checked ? true : false } disabled={props.disabled ? true : false} onChange={() => props.callback(index)} />
              {item}
          </label>
        );
      })}
    </div>
  );
}

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      answers: Array(CORRECT_ANSWER.length).fill(0)
    };
  }

  changeArrAnswer = (index, value) => {
    let arr = this.state.answers.concat();
    arr[index] = value;
    this.setState({
      answers: arr
    });
  }

  checkAllAnswers = () => {
    if(this.state.isChecked) {
      this.setState({
        isChecked: false,
        answers: Array(CORRECT_ANSWER.length).fill(0)
      })
    } else {
      this.setState({
        isChecked: true
      });
    }
  }

  /*** check one answer and output div with correct and your answer ***/
  checkAnswer = (correctAnswer, yourAnswer, index) => {
    let elem;
    if (correctAnswer === yourAnswer) {
      elem = (<div className="correct">Правильно</div>);
    } else {
      elem = (<div className="incorrect">Правильный ответ "{QUESTIONS[index].variants[correctAnswer]}". Ваш ответ "{QUESTIONS[index].variants[yourAnswer]}".</div>);
    }
    return elem;
  }

  render() {
    let questionElems;
    let func = this.changeArrAnswer;
    let answers = this.state.answers;
    let show = this.state.isChecked;
    let checkAnswer = this.checkAnswer;
    let countCorrectAnswers = 0;

    questionElems = QUESTIONS.map(function(item, index) {
      let elemCheck;
      if(show) {
        elemCheck = checkAnswer(CORRECT_ANSWER[index], answers[index], index);
      }

      return (
        <div className="questions__wrap" key={index}>
          <Question item={item} index={index} callback={value => func(index, value)} checked={answers[index]} disabled={show}/>
          {show ? elemCheck : false}
        </div>
      );
    })

    /***count correct answers***/
    if(show) {
      for(let i = 0; i < CORRECT_ANSWER.length; i++) {
        if(CORRECT_ANSWER[i] === answers[i]) countCorrectAnswers++;
      }

      let percent = countCorrectAnswers/CORRECT_ANSWER.length;
      let resultClass;

      for(let key in RESULT) {
        if(percent*100 >= key) {
          if(percent*100 < 21) resultClass = 'result verybad';
          else if(percent*100 < 41) resultClass = 'result bad';
          else if(percent*100 < 61) resultClass = 'result normal';
          else if(percent*100 < 81) resultClass = 'result good';
          else resultClass = 'result excellent';
          var elemResult = (<div className={resultClass}>{RESULT[key]} {countCorrectAnswers} правильный ответов из {CORRECT_ANSWER.length}.</div>);
        }
      }
    }

    return (
      <>
        <h1 className="questions__header">Ответьте пожалуйста на вопросы ниже</h1>
        {questionElems}
        <input className="questions__button" type="button" value={this.state.isChecked ? 'Сброс' : 'Проверить'} onClick={this.checkAllAnswers} />
        {show ? elemResult : false}
      </>
    );
  }
}

ReactDOM.render(
  <Questions />,
  document.getElementsByClassName('questions')[0]
);
