def find_highest(marks):
    if len(marks) == 0:
        return None   # condition: empty list

    highest = marks[0]  # assume first element is highest

    # using for loop
    for mark in marks:
        if mark > highest:
            highest = mark

    return highest


# Example array
marks_list = [45, 99, 72, 88, 56, 100, 67]

# Call the function
result = find_highest(marks_list)

print("Highest Marks =", result)
