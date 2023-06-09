USE employee_db;

TRUNCATE TABLE employee;

INSERT INTO department (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Engineering'),
       ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 75000, 1),
       ('Marketing Manager', 70000, 2),
       ('Software Engineer', 85000, 3),
       ('HR Manager', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, NULL),
       ('Mike', 'Johnson', 3, 1),
       ('Emily', 'Brown', 4, 2),
       ('Kevin', 'Martinez', 3, 1),
       ('Laura', 'Davis', 3, 1),
       ('Tom', 'Garcia', 1, NULL),
       ('Linda', 'Lee', 2, NULL),
       ('Nathan', 'Harris', 3, 7),
       ('Samantha', 'Clark', 4, 8),
       ('Dave', 'Lewis', 3, 7),
       ('Fuaad', 'Shobambi', 1, NULL),
       ('Ade', 'Xavier', 2, NULL);
