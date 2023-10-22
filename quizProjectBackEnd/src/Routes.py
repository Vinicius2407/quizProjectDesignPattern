from flask import Flask, jsonify, request
from flask_cors import CORS

from EStrategy import StrategyEnum
from StrategyDifficulty import get_weighted_difficulty_strategy
from Quiz import Quiz

app = Flask(__name__)
CORS(app)

@app.route("/start-quiz/<dificuldade>", methods=["GET"])
def start_quiz(dificuldade):
    global quiz_instance
    try:
        numeroDificuldade = int(dificuldade)
        dificuldade = StrategyEnum(numeroDificuldade)
        weighted_difficulty_strategy = get_weighted_difficulty_strategy(dificuldade)
        quiz_instance = Quiz()
        quiz_instance.difficulty_strategy = weighted_difficulty_strategy
        quiz_instance.criaQuiz("../data/perguntas.json")

        return jsonify({"message": "Quiz started"})
    except ValueError:
        return jsonify({"error": "Dificuldade não reconhecida"})

@app.route("/get-question", methods=["GET"])
def get_question():
    global quiz_instance
    next_question = quiz_instance.get_proxima_questao()
    if next_question is not None:
        return jsonify(
            {
                "message": "Next question",
                "next_question": {
                    "id": next_question.id,
                    "pergunta": next_question.pergunta,
                    "opcoes": next_question.opcoes,
                    "tema": next_question.tema,
                    "dificuldade": next_question.dificuldade.value,
                },
            }
        )
    else:
        return jsonify(
            {"message": "Quiz completed", "result": quiz_instance.resultado, "questoes_acertadas": str(quiz_instance.questoes_acertadas) + "/" + str(len(quiz_instance.vetor)) + ". O peso das perguntas com a dificuldade escolhida foi multiplicado por " + str(quiz_instance.difficulty_strategy.peso)}
        )

@app.route("/submit-answer", methods=["POST"])
def submit_answer():
    global quiz_instance
    data = request.get_json()
    user_ans = data.get("user_answer", "").upper()

    if user_ans != "":
        quiz_instance.avaliar_resposta(user_ans)

    return jsonify({"message": "Answer submitted"})


@app.route("/restart-quiz", methods=["GET"])
def restart_quiz():
    global quiz_instance
    quiz_instance = None  # Defina a instância do Quiz como None para reiniciar
    return jsonify({"message": "Quiz restarted"})

if __name__ == "__main__":
    app.run(debug=True)