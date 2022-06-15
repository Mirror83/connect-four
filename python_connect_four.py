import pygame
import numpy as np
import sys


ROWS = 6
COLUMNS = 7

LIMIT = 3

# RGB colors
BLUE = (0, 0, 200)
BLACK = (0, 0, 0)
YELLOW = (200, 200, 0)
RED = (200, 0, 0)

pygame.font.init()
my_font = pygame.font.Font("./freesansbold.ttf", 65)


def create_board():
    board = np.zeros((ROWS, COLUMNS))
    return board


def is_valid_position(board, column):
    return board[ROWS - 1][column] == 0


def get_next_open_row(board, column):
    for row in range(ROWS):
        if board[row][column] == 0:
            return row


def drop_piece(board, row, column, piece):
    board[row][column] = piece


def print_board(board):
    flipped = np.flip(board, 0)
    print(flipped)


def winning_move(board, piece):
    # Check for horizontal win
    for row in range(ROWS):
        for column in range(COLUMNS - LIMIT):
            if board[row][column] == piece and \
               board[row][column + 1] == piece and \
               board[row][column + 2] == piece and \
               board[row][column + LIMIT] == piece:
                return True
    # Check for vertical win
    for row in range(ROWS - LIMIT):
        for column in range(COLUMNS):
            if board[row][column] == piece and \
               board[row + 1][column] == piece and \
               board[row + 2][column] == piece and \
               board[row + LIMIT][column] == piece:
                return True
    # Check for positively sloped win
    for row in range(ROWS - LIMIT):
        for column in range(COLUMNS - LIMIT):
            if board[row][column] == piece and \
               board[row + 1][column + 1] == piece and \
               board[row + 2][column + 2] == piece and \
               board[row + LIMIT][column + LIMIT] == piece:
                return True
    # Check for negatively sloped win
    for row in range(LIMIT, ROWS):
        for column in range(COLUMNS - LIMIT):
            if board[row][column] == piece and \
               board[row - 1][column + 1] == piece and \
               board[row - 2][column + 2] == piece and \
               board[row - LIMIT][column + LIMIT] == piece:
                return True


def draw_board(board):
    # Build the background first
    for column in range(COLUMNS):
        for row in range(ROWS):
            pygame.draw.rect(window, BLUE, (column * SQUARE_SIZE,
                                            row * SQUARE_SIZE + SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
            pygame.draw.circle(window, BLACK, (column * SQUARE_SIZE + SQUARE_SIZE // 2,
                                               row * SQUARE_SIZE + SQUARE_SIZE // 2 + SQUARE_SIZE),
                               RADIUS)
    # Place the colored circles after the background has been built
    for column in range(COLUMNS):
        for row in range(ROWS):
            if board[row][column] == 1:
                pygame.draw.circle(window, RED, (column * SQUARE_SIZE + SQUARE_SIZE // 2,
                                                 height - (row * SQUARE_SIZE + SQUARE_SIZE // 2)),
                                   RADIUS)
            elif board[row][column] == 2:
                pygame.draw.circle(window, YELLOW, (column * SQUARE_SIZE + SQUARE_SIZE // 2,
                                                    height - (row * SQUARE_SIZE + SQUARE_SIZE // 2)),
                                   RADIUS)
        pygame.display.update()


board = create_board()
game_over = False
current_player = 1

# Initialize pygame
pygame.init()

# Screen setup
SQUARE_SIZE = 100
width = COLUMNS * SQUARE_SIZE
height = (ROWS + 1) * SQUARE_SIZE
SIZE = (width, height)
RADIUS = (SQUARE_SIZE // 2) - 5

window = pygame.display.set_mode(SIZE)
draw_board(board)
pygame.display.update()

# Game Loop
while not game_over:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()

        if event.type == pygame.MOUSEMOTION:
            mouse_pos_x = event.pos[0]
            pygame.draw.rect(window, BLACK, (0,
                             0, width, SQUARE_SIZE))
            if current_player == 1:
                pygame.draw.circle(
                    window, RED, (mouse_pos_x, SQUARE_SIZE // 2), RADIUS)
            elif current_player == 2:
                pygame.draw.circle(
                    window, YELLOW, (mouse_pos_x, SQUARE_SIZE // 2), RADIUS)
            pygame.display.update()

        if event.type == pygame.MOUSEBUTTONDOWN:
            if current_player == 1:
                pos_x = event.pos[0]
                column = pos_x // 100
                if is_valid_position(board, column):
                    row = get_next_open_row(board, column)
                    drop_piece(board, row, column, current_player)
                    print_board(board)
                    draw_board(board)

                    if winning_move(board, current_player):
                        pygame.draw.rect(window, BLACK, (0,
                                                         0, width, SQUARE_SIZE))
                        label = my_font.render("Player 1 wins!", 1, RED)
                        window.blit(label, (110, 20))
                        pygame.display.update()
                        game_over = True
                        pygame.time.wait(3000)
                        pygame.display.quit()
                        break

                    current_player = 2
            else:
                pos_x = event.pos[0]
                column = pos_x // 100
                if is_valid_position(board, column):
                    row = get_next_open_row(board, column)
                    drop_piece(board, row, column, current_player)
                    print_board(board)
                    draw_board(board)

                    if winning_move(board, current_player):
                        pygame.draw.rect(window, BLACK, (0,
                                                         0, width, SQUARE_SIZE))
                        label = my_font.render("Player 2 wins!", 1, YELLOW)
                        window.blit(label, (110, 20))
                        pygame.display.update()
                        game_over = True
                        pygame.time.wait(3000)
                        pygame.display.quit()
                        break

                current_player = 1
