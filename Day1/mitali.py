# Define a class for Student
class Student:
    def __init__(self, name, age, roll_no, course):
        self.name = name
        self.age = age
        self.roll_no = roll_no
        self.course = course

    # Method to display details
    def display_details(self):
        print("----- Student Details -----")
        print(f"Name     : {self.name}")
        print(f"Age      : {self.age}")
        print(f"Roll No. : {self.roll_no}")
        print(f"Course   : {self.course}")


# Create an object of Student
student1 = Student("Arshuuu", 21, "CSE101", "B.Tech CSE")

# Print details
student1.display_details()
