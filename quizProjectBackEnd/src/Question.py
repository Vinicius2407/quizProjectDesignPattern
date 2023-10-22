from EStrategy import StrategyEnum

class Question:
    def __init__(self, id, pergunta, opcoes, resposta, tema, dificuldade, peso=1):
        self.id = id
        self.pergunta = pergunta
        self.opcoes = opcoes
        self.resposta = resposta
        self.tema = tema
        self.dificuldade = dificuldade
        self.peso = peso

class QuestionFactory:
    @staticmethod
    def create(q) -> Question:
        return Question(
            q["id"],
            q["pergunta"],
            q["opcoes"],
            q["resposta"],
            q["tema"],
            StrategyEnum(q["dificuldade"]),
            q.get("peso")
        )