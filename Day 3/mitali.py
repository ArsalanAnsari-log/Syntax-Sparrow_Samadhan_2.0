def student_marks_calculator():
    name = input("Enter Student Name: ")
    n = int(input("Enter number of subjects: "))

    marks = []
    total = 0

    for i in range(n):
        m = int(input(f"Enter marks of subject {i+1}: "))
        marks.append(m)
        total += m

    avg = total / n

    print("\n----- Student Marks Report -----")
    print("Name      :", name)
    print("Marks     :", marks)
    print("Total     :", total)
    print("Average   :", avg)

    # Grade condition
    if avg >= 90:
        grade = "A"
    elif avg >= 75:
        grade = "B"
    elif avg >= 50:
        grade = "C"
    else:
        grade = "F"

    print("Grade     :", grade)


# Run the calculator
student_marks_calculator()
