USE employees_db;

INSERT INTO departments (department_name)
VALUES  ("Legal"),
        ("Marketing"),
        ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Manager", 100000, 1),
        ("Market Analyst", 75000, 2),
        ("Software Engineer", 90000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
("Ben", "Carpenter", 1, null),
("Jack", "Carpenter", 2, 1),
("George", "Carpenter", 3, 1);