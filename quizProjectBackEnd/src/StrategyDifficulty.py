import random

from EStrategy import StrategyEnum

class DifficultyStrategy:
    def select_questions(self, questions):
        pass

class WeightedDifficultyStrategy(DifficultyStrategy):
    def __init__(self, difficulty, peso):
        self.difficulty = difficulty
        self.peso = peso

    def select_questions(self, questions):
        selected_questions = []
        for question in questions:
            if question.dificuldade == self.difficulty:
                question.peso += self.peso  # Multiplica o peso da pergunta
                selected_questions.append(question)  # Adiciona a pergunta com peso multiplicado
                random.shuffle(selected_questions)  # Embaralha as perguntas

        return selected_questions

def get_weighted_difficulty_strategy(dificuldade):
    if dificuldade == StrategyEnum.FACIL:
        return WeightedDifficultyStrategy(dificuldade, 2)  # Dificuldade fácil tem peso 2
    elif dificuldade == StrategyEnum.MEDIO:
        return WeightedDifficultyStrategy(dificuldade, 4)  # Dificuldade média tem peso 4
    elif dificuldade == StrategyEnum.DIFICIL:
        return WeightedDifficultyStrategy(dificuldade, 6)  # Dificuldade difícil tem peso 6