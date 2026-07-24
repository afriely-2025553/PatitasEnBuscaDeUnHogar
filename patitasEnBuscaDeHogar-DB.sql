drop database if exists PatitasEnBuscaDeHoga_in5cm;
create database PatitasEnBuscaDeHoga_in5cm;

use PatitasEnBuscaDeHoga_in5cm;

create table Especies(
	id_especie int auto_increment,
	nombreEspecie varchar(100),
    primary key PK_id_especie(id_especie)
);

create table Veterinarios(
	id_veterinario int auto_increment,
	nombreVeterinario varchar(100),
	telefonoVeterinario bigint,
    primary key PK_id_veterinario(id_veterinario)
);

create table Refugios(
	id_refugio int auto_increment,
	nombreRefugio varchar(100),
	direccionRefugio varchar(200),
    telefonoRefugio bigint,
    primary key PK_id_refugio(id_refugio)
);

create table Adoptantes(
	id_adoptante int auto_increment,
	nombreAdoptante varchar(100),
	telefonoAdoptante bigint,
	direccion varchar(200),
    primary key id_adoptante(id_adoptante)
);

create table Razas(
	id_raza int auto_increment,
	nombreRaza varchar(100),
	id_especie int,
    primary key PK_id_raza(id_raza),
    constraint FK_id_especie foreign key (id_especie)
	references Especies(id_especie) on delete cascade
);

create table Donaciones(
	id_donacion int auto_increment,
    tipoDonacion enum ('Monetaria', 'Bienes Materiales'),
    montoDonacion decimal (10,2),
    fechaDonacion date,
    id_refugio int,
    primary key id_donacion(id_donacion),
    constraint Fk_id_refugio foreign key (id_refugio)
    references Refugios(id_refugio) on delete cascade
);

create table Voluntarios(
	id_voluntario int auto_increment,
    nombreVoluntario varchar (100),
    telefonoVoluntario varchar(10),
    id_refugio int,
    primary key id_voluntario(id_voluntario),
    constraint Fk_id_refugio foreign key (id_refugio)
    references Refugios(id_refugio) on delete cascade
);

create table Vacunas(
	id_vacuna int auto_increment,
	nombreVacuna enum('Antirrabica', 'Moquillo', 'Parvovirus', 'Complejos Respiratorios'),
	fechaDeAplicacion date,
    id_animal int,
	id_veterinario int,
    primary key id_vacuna(id_vacuna),
    constraint Fk_id_animal foreign key (id_animal)
    references Animales(id_animal) on delete cascade
);

create table Adopciones(
	id_adopcion int auto_increment,
	fechaDeAdopcion date,
	id_animal int,
	id_adoptante int,
    primary key id_adopcion(id_adopcion),
    constraint Fk_id_animal foreign key (id_animal)
    references Animales(id_animal) on delete cascade,
    constraint Fk_id_adoptante foreign key (id_adoptante)
    references Adoptantes(id_adoptante)
);


create table Animales(
	id_animal int auto_increment,
	nombreAnimal varchar(100),
	edadAnimal int,
	sexoAnimal varchar(50),
	estadoAnimal enum('Disponible', 'Reservado', 'En veterianaria', 'Adoptado'),
	id_refugio int,
	id_especie int,
	id_raza int,
    primary key PK_id_animal(id_animal),
    constraint FK_id_refugio foreign key (id_refugio)
    references Refugios(id_refugio) on delete cascade,
    constraint Fk_id_especie foreign key (id_especie)
    references Especies(id_especie) on delete cascade,
    constraint Fk_id_raza foreign key (id_raza)
    references Razas(id_raza)on delete cascade
);


-- CRUD ESPECIES --

-- CRUD VETERINARIOS --

-- CRUD REFUGIOS --

-- CRUD ADOPTANTES --