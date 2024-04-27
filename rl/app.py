from flask import Flask, jsonify
import numpy as np
import random
from flask_cors import CORS
from collections import deque

app = Flask(__name__)
CORS(app)

alpha = 0.1
gamma = 0.6
epsilon = 0.1
q_table = np.zeros((2, 2))
last_actions = deque(maxlen=20)

def step(state, action):
    global last_actions
    last_actions.append(action)
    maintenance_count = sum(1 for a in last_actions if a == 1)
    breakdown_chance = 0.05 if maintenance_count < 4 else 0.03
    if action == 1:
        if state == 1:
            return 0, -5
        else:
            return 0, -2
    elif state == 0:
        if random.random() < breakdown_chance:
            return 1, -10
        else:
            return 0, 1
    elif state == 1:
        return 1, -10

@app.route('/run_episode', methods=['GET'])
def run_episode():
    # state_reward = {0: 0, 1: 0}
    # state_performance = {0: [], 1: []}

    state_rewards = {0: 0, 1: 0}  # Initialize cumulative rewards for each state
    discount_factor = 0.99  # Discount factor for future rewards
    discount_power = {0: 0, 1: 0}  # To keep track of power exponent for each state


    state = 0
    transitions = []
    for _ in range(999999):
        action = np.argmax(q_table[state]) if random.random() > epsilon else random.randint(0, 1)
        next_state, reward = step(state, action)
        # state_reward[state] += reward

        state_rewards[state] += reward * (discount_factor ** discount_power[state])
        discount_power[state] += 1  # Increase power for the discount factor for this state
        state_rewards[state] = round(state_rewards[state], 2)  # Round to two decimal places

        # Reset discount power if transitioning to a different state
        if next_state != state:
            discount_power[next_state] = 0


        # min_reward = -10 if state == 1 else -2
        # max_reward = 1 if state == 0 else 0
        # performance = ((state_reward[state] - min_reward) / (max_reward - min_reward) * 100) if max_reward != min_reward else 0
        # state_performance[state].append(performance)
        q_table[state, action] = float(alpha * (reward + gamma * np.max(q_table[next_state]) - q_table[state, action]))
        # transitions.append((int(state), int(action), int(reward), int(next_state), state_reward[state], state_performance[state][-1]))
        transitions.append((int(state), int(action), int(reward), int(next_state), state_rewards.copy()))

        state = next_state
    return jsonify({
        'transitions': transitions
    })

if __name__ == '__main__':
    app.run(debug=True)
