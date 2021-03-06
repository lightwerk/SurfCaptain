<?php
namespace TYPO3\Flow\Persistence\Doctrine\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration,
	Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your need!
 */
class Version20140729185043 extends AbstractMigration {

	/**
	 * @param Schema $schema
	 * @return void
	 */
	public function up(Schema $schema) {
		// this up() migration is autogenerated, please modify it to your needs
		$this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
		
		$this->addSql("CREATE TABLE lightwerk_surfclasses_domain_model_deployment (persistence_object_identifier VARCHAR(40) NOT NULL, project INT NOT NULL, reference LONGTEXT NOT NULL, referencename LONGTEXT NOT NULL, clientip LONGTEXT NOT NULL, status VARCHAR(255) NOT NULL, date DATETIME NOT NULL, configuration LONGTEXT NOT NULL COMMENT '(DC2Type:json_array)', PRIMARY KEY(persistence_object_identifier)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB");
		$this->addSql("CREATE TABLE lightwerk_surfclasses_domain_model_log (persistence_object_identifier VARCHAR(40) NOT NULL, deployment VARCHAR(40) DEFAULT NULL, date DATETIME NOT NULL, number INT NOT NULL, message VARCHAR(255) NOT NULL, severity VARCHAR(255) NOT NULL, INDEX IDX_B674A6BFEB1255BE (deployment), PRIMARY KEY(persistence_object_identifier)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB");
		$this->addSql("ALTER TABLE lightwerk_surfclasses_domain_model_log ADD CONSTRAINT FK_B674A6BFEB1255BE FOREIGN KEY (deployment) REFERENCES lightwerk_surfclasses_domain_model_deployment (persistence_object_identifier)");
	}

	/**
	 * @param Schema $schema
	 * @return void
	 */
	public function down(Schema $schema) {
		// this down() migration is autogenerated, please modify it to your needs
		$this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
		
		$this->addSql("ALTER TABLE lightwerk_surfclasses_domain_model_log DROP FOREIGN KEY FK_B674A6BFEB1255BE");
		$this->addSql("DROP TABLE lightwerk_surfclasses_domain_model_deployment");
		$this->addSql("DROP TABLE lightwerk_surfclasses_domain_model_log");
	}
}