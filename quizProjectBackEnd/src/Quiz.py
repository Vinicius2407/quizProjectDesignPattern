import json
from Question import QuestionFactory

class Quiz:
    _instance = None

    def __init__(self):
        self.resultado = 0
        self.questoes = 0
        self.questoes_acertadas = 0
        self.vetor = []
        self.difficulty_strategy = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def criaQuiz(self, filename):
        with open(filename, "r", encoding="utf-8-sig") as f:
            data = json.load(f)

        questions = data
        self.vetor = [QuestionFactory.create(q) for q in questions]

        selected_questions = self.difficulty_strategy.select_questions(self.vetor)
        self.vetor = selected_questions
        print(self.vetor)

    def avaliar_resposta(self, resposta):
        if resposta == self.vetor[self.questoes].resposta:
            self.resultado += self.vetor[self.questoes].peso
            self.questoes_acertadas += 1
        self.questoes += 1
        if self.questoes >= len(self.vetor):
            return True  # O quiz está completo
        return False  # O quiz ainda não está completo

    def get_proxima_questao(self):
        if self.questoes >= len(self.vetor):
            return None
        return self.vetor[self.questoes]
