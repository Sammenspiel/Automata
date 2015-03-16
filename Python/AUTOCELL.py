import random as rnd

################################################
# Simulates a grid of automata, which update   #
# their states according to the given rule set #
################################################
#INPUT:
#
#-width, height: [int] dimensions of table (in cells)
#
#-states: [tuple] display characters for each state
#
#-rules: [array of int] contains the target state values,
#        indexed by the sum of neighbor states for a
#        specific cell
#
#-nbrhd: [array of tuple] contains the *relative* (x, y)
#        positions of all neighbors with respect
#        to a specific cell
#
#-wrap: [bool] dictates whether or not a cell may
#       consider neighbors on opposite sides of table
#       part of its neighborhood
#
#-wall: [int] the default state of any "out of bounds" cell
#       when selecting a neighbor with the walled option.
#
#-name: [str] identifying name for the table
#
#-limit: [int] number of generations allowed before the
#        simulation stops updating (-1 means no limit)
#
class AutomataTable(object):
    def __init__(self, w, h, st, ru, nh, wr=False, wa=0, nm='Automata Table', li=-1):
        self.gen    = 0
        self.width  = w
        self.height = h
        self.states = st
        self.rules  = ru
        self.nbrhd  = nh
        self.wrap   = wr
        self.name   = nm
        self.limit  = li
        self.wall   = wa
        self.cells  = None
        self.buffer = None
        
    def draw(self):
        print('{0} Generation {1}:'.format(self.name, self.gen))
        tableImg = ""
        
        for j in range(self.height):
            for i in range(self.width):
                tableImg += self.states[self.cells[j][i]] + ' '
            tableImg += '\n'
            
        print(tableImg)

    #set up table with 2D array of state 0
    def initBlank(self):
        self.cells  = [[0 for i in range(self.width)] for j in range(self.height)]
        self.buffer = [[0 for i in range(self.width)] for j in range(self.height)]
        self.gen = 0

    #set up table with randomized 2D array
    def initRandom(self):
        stateRange = len(self.states) - 1
        self.cells  = [[rnd.randint(0, stateRange) for i in range(self.width)] for j in range(self.height)]
        self.buffer = [[0 for i in range(self.width)] for j in range(self.height)]
        self.gen = 0
    
    #set up table with predetermined 2D array
    def initPreset(self, c):
        self.cells  = c
        self.width  = len(c[0])
        self.height = len(c)
        self.buffer = [[0 for i in range(self.width)] for j in range(self.height)]
        self.gen = 0

    #get a neighbor cell state, with cells across the table being neighbors
    def neighborWrap(self, x, y, i):
        nx = x + self.nbrhd[i][0]
        ny = y + self.nbrhd[i][1]

        if(nx < 0):
            nx = self.width + nx
        elif(nx >= self.width):
            nx = nx - self.width
        
        if(ny < 0):
            ny = self.height + ny
        elif(ny >= self.height):
            ny = ny - self.height
        
        return self.cells[ny][nx]

    #get a neighbor cell state, with out-of-bounds being a default value
    def neighborWall(self, x, y, i):
        nx = x + self.nbrhd[i][0]
        ny = y + self.nbrhd[i][1]
        
        if(nx < 0 or nx >= self.width or ny < 0 or ny >= self.height):
            return self.wall
        return self.cells[ny][nx]

    #select next state of a cell, given the states of its neighbors
    def calcState(self, x, y):
        nSum = 0
        
        for i in range(len(self.nbrhd)):
            if(self.wrap):
                nSum += self.neighborWrap(x, y, i)
            else:
                nSum += self.neighborWall(x, y, i)

        nextState = self.rules[nSum]
        
        if(nextState >= 0):
            self.buffer[y][x] = nextState
        else:
            self.buffer[y][x] = self.cells[y][x]

    def update(self):
        if(self.gen == self.limit):
            print('{0} reached limit of {1} generations'.format(self.name, self.gen))
            return
            
        for j in range(self.height):
            for i in range(self.width):
                self.calcState(i, j)
                
        self.cells, self.buffer = self.buffer, self.cells
        self.gen += 1

        print('Updated {0}'.format(self.name))

    def step(self):
        self.update()
        self.draw()

    def toEnd(self):
        if(self.limit < 0):
            print('{0} has no generation limit'.format(self.name))
            return

        for g in range(self.gen, self.limit):
            self.update()

        print('Skipped to end of generation limit')
        self.draw()


################
# RULE PRESETS #
################

Neighborhoods = {'Moore':
                 [(-1, -1), ( 0, -1), ( 1, -1),
                  (-1,  0),           ( 1,  0),
                  (-1,  1), ( 0,  1), ( 1,  1)],
                 'vonNeumann':
                 [          ( 0, -1),
                  (-1,  0),           ( 1,  0),
                            ( 0,  1)          ]}

GameOfLife = {'states': ('.', 'O'),
              'rules': [0, 0, -1, 1, 0, 0, 0, 0, 0],
              'nbrhd': Neighborhoods['Moore']}

CaveGen    = {'states': ('.', 'O'),
              'rules': [0, 0, 0, -1, -1, -1, 1, 1, 1],
              'nbrhd': Neighborhoods['Moore']}

IslandGen  = {'states': ('.', 'O'),
              'rules': [0, 0, 0, 0, -1, -1, -1, 1, 1],
              'nbrhd': Neighborhoods['Moore']}

TunnelGen  = {'states': ('.', 'O'),
              'rules': [0, 0, -1, -1, 1, 1, 0, 0, 0],
              'nbrhd': Neighborhoods['Moore'],
              'wrap': False}
