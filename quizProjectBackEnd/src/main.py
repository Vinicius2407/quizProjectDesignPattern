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

    def avaliar_resposta(self, resposta):
        if resposta == self.vetor[self.questoes].resposta:
            self.resultado += 1
        self.questoes += 1
        if self.questoes >= len(self.vetor):
            return True  # O quiz está completo
        return False  # O quiz ainda não está completo

    def get_proxima_questao(self):
        if self.questoes >= len(self.vetor):
            return None
        return self.vetor[self.questoes]


if __name__ == "__main__":
    quiz_instance = Quiz()  # Move this line here to create the Quiz instance

    @app.route("/start-quiz", methods=["GET"])
    def start_quiz():
        # Inicialize um novo quiz
        quiz_instance.criaQuiz("../data/perguntas.json")
        return jsonify({"message": "Quiz started"})

    @app.route("/submit-answer", methods=["POST"])
    def submit_answer():
        data = request.get_json()
        user_ans = data.get("user_answer", "").upper()
        primeira_pergunta = data.get("primeira_pergunta", 0)
        if quiz_instance.avaliar_resposta(user_ans):
            # Changed the message to indicate a successful answer submission
            return jsonify({"message": "Quiz Completed", "result": quiz_instance.resultado})

        if user_ans != "" or primeira_pergunta == 0:
            next_question = quiz_instance.get_proxima_questao()

            if next_question is not None:
                return jsonify(
                    {
                        "message": "Next question",
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
                return_json = jsonify(
                    {"message": "Quiz completed", "result": quiz_instance.resultado}
                )

                return return_json
        else:
            return jsonify({"message": "Next question"})

    app.run(debug=True)
