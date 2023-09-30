from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json

app = Flask(__name__)
CORS(app)


class Question:
    def __init__(self, id, pergunta, opcoes, resposta, tema, dificuldade):
        self.id = id
        self.pergunta = pergunta
        self.opcoes = opcoes
        self.resposta = resposta
        self.tema = tema
        self.dificuldade = dificuldade


class QuestionFactory:
    @staticmethod
    def create(q) -> Question:
        return Question(
            q["id"],
            q["pergunta"],
            q["opcoes"],
            q["resposta"],
            q["tema"],
            q["dificuldade"],
        )


class Strategy:
    @staticmethod
    def ordenar(vetor, option):
        if option == StrategyEnum.ORDENADO.value:
            vetor.sort(key=lambda x: (x.tema, x.dificuldade))
        else:
            random.shuffle(vetor)


from enum import Enum


class StrategyEnum(Enum):
    ORDENADO = 1
    EMBARALHAR = 2


class Quiz:
    _instance = None

    def __init__(self):
        self.resultado = 0
        self.questoes = 0
        self.vetor = []

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def criaQuiz(self, filename):
        with open(filename, "r", encoding="utf-8-sig") as f:
            data = json.load(f)

        questions = data
        self.vetor = [QuestionFactory.create(q) for q in questions]
        acertos = 0
        Strategy.ordenar(self.vetor, 2)  # Alterei para questões ordenadas como padrão

    def avaliarResposta(self, resposta):
        if resposta == self.vetor[self.questoes].resposta:
            self.resultado += 1
        self.questoes += 1
        if self.questoes >= len(self.vetor):
            return True  # O quiz está completo
        return False  # O quiz ainda não está completo

    def getProximaQuestao(self):
        if self.questoes >= len(self.vetor):
            return None
        return self.vetor[self.questoes]


if __name__ == "__main__":
    app.run(debug=True)

    quiz_instance = Quiz()

@app.route("/start-quiz", methods=["GET"])
def start_quiz():
    # Inicialize um novo quiz
    quiz_instance.criaQuiz("quizProjectBackEnd\data\perguntas.json")
    return jsonify({"message": "Quiz started"})

@app.route("/submit-answer", methods=["POST"])
def submit_answer():
    data = request.get_json()
    user_ans = data.get("user_answer", "").upper()

    if quiz_instance.avaliarResposta(user_ans):
        return jsonify(
            {"message": "Quiz completed", "result": quiz_instance.resultado}
        )

    next_question = quiz_instance.getProximaQuestao()

    if next_question is not None:
        return jsonify(
            {
                "message": "Answer submitted",
                "result": quiz_instance.resultado,
                "next_question": {
                    "id": next_question.id,
                    "pergunta": next_question.pergunta,
                    "opcoes": next_question.opcoes,
                    "tema": next_question.tema,
                    "dificuldade": next_question.dificuldade,
                },
            }
        )
    else:
        json = jsonify(
            {"message": "Quiz completed", "result": quiz_instance.resultado}
        )

        return json
