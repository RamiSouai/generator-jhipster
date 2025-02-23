/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-unused-expressions */

import fs from 'fs';
import path, { dirname } from 'path';
import { jestExpect } from 'esmocha';
import { expect } from 'chai';
import { fileURLToPath } from 'url';
import { convertToJDL, convertSingleContentToJDL } from '../converters/json-to-jdl-converter.js';
import { basicHelpers as helpers } from '../../test/support/helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('jdl - JSONToJDLConverter', () => {
  beforeEach(async () => {
    await helpers.prepareTemporaryDir();
  });

  describe('convertToJDL', () => {
    context('when there is a yo-rc file in the passed directory', () => {
      let dir;
      let jdlFilename;
      let jdlFileContent;

      context('without entities', () => {
        beforeEach(() => {
          dir = path.join(__dirname, '..', '__test-files__', 'json_to_jdl_converter', 'only_app');
          jdlFilename = 'app.jdl';
          convertToJDL(dir);
          jdlFileContent = fs.readFileSync(path.join(dir, jdlFilename), 'utf-8');
        });

        it('should write a JDL file with the application', () => {
          jestExpect(jdlFileContent).toMatchInlineSnapshot(`
            "application {
              config {
                applicationType microservice
                authenticationType jwt
                baseName truc
                blueprints [generator-jhipster-vuejs, generator-jhipster-dotnetcore]
                buildTool maven
                cacheProvider hazelcast
                clientPackageManager npm
                databaseType sql
                devDatabaseType h2Disk
                dtoSuffix DTO
                enableHibernateCache true
                enableSwaggerCodegen false
                enableTranslation false
                jhiPrefix jhi
                jhipsterVersion "6.0.1"
                jwtSecretKey "HIDDEN"
                messageBroker no
                nativeLanguage en
                packageName com.mycompany.myapp
                prodDatabaseType mysql
                searchEngine no
                serverPort 8081
                serviceDiscoveryType eureka
                skipClient true
                skipUserManagement true
                testFrameworks []
                websocket no
              }
            }

            "
          `);
        });
      });
      context('with entities', () => {
        beforeEach(() => {
          dir = path.join(__dirname, '..', '__test-files__', 'json_to_jdl_converter', 'app_with_entities');
          jdlFilename = 'app.jdl';
          convertToJDL(dir);
          jdlFileContent = fs.readFileSync(path.join(dir, jdlFilename), 'utf-8');
        });

        it('should export apps & entities', () => {
          jestExpect(jdlFileContent).toMatchInlineSnapshot(`
            "application {
              config {
                applicationType microservice
                authenticationType jwt
                baseName truc
                buildTool maven
                cacheProvider hazelcast
                clientPackageManager npm
                databaseType sql
                devDatabaseType h2Disk
                dtoSuffix DTO
                enableHibernateCache true
                enableSwaggerCodegen false
                enableTranslation false
                jhiPrefix jhi
                jhipsterVersion "6.0.1"
                jwtSecretKey "HIDDEN"
                messageBroker no
                nativeLanguage en
                packageName com.mycompany.myapp
                prodDatabaseType mysql
                searchEngine no
                serverPort 8081
                serviceDiscoveryType eureka
                skipClient true
                skipUserManagement true
                testFrameworks []
                websocket no
              }

              entities Country, Department, Employee, Job, JobHistory, Location, Region, Task
            }

            entity Country {
              countryName String
            }
            entity Department {
              departmentName String
            }
            entity Employee {
              firstName String
              lastName String
              email String
              phoneNumber String
              hireDate ZonedDateTime
              salary Long
              commissionPct Long
            }
            entity Job {
              jobTitle String
              minSalary Long
              maxSalary Long
            }
            entity JobHistory {
              startDate ZonedDateTime
              endDate ZonedDateTime
            }
            entity Location {
              streetAddress String
              postalCode String
              city String
              stateProvince String
            }
            entity Region {
              regionName String
            }
            entity Task {
              title String
              description String
            }
            relationship OneToOne {
              Country{region required} to Region
              Department{location required} to Location
              JobHistory{department required} to Department
              JobHistory{job required} to Job
              JobHistory{employee required} to Employee
              Location{country required} to Country
            }
            relationship OneToMany {
              Department{employee} to Employee
              Employee{job} to Job
            }
            relationship ManyToOne {
              Employee{department} to Department{employee}
              Employee{manager} to Employee
              Job{employee} to Employee{job}
            }
            relationship ManyToMany {
              Job{task} to Task{job}
              Task{job} to Job{task}
            }

            noFluentMethod Country, Department, Employee, Job, JobHistory, Location, Region, Task
            paginate Country with pager
            "
          `);
        });
      });
    });
    context('when there is no yo-rc file in the passed directory', () => {
      context('with no JHipster app', () => {
        it('does not fail', () => {
          expect(() => convertToJDL()).not.to.throw();
        });
      });
      context('with several JHipster apps', () => {
        let rootDir;
        let jdlFilename;
        let jdlFileContent;

        beforeEach(() => {
          rootDir = path.join(__dirname, '..', '__test-files__', 'json_to_jdl_converter', 'multi_apps');
          jdlFilename = 'app.jdl';
          convertToJDL(rootDir);
          jdlFileContent = fs.readFileSync(path.join(rootDir, jdlFilename), 'utf-8');
        });

        it('should export each app', () => {
          jestExpect(jdlFileContent).toMatchInlineSnapshot(`
            "application {
              config {
                applicationType microservice
                authenticationType jwt
                baseName app1
                buildTool maven
                cacheProvider hazelcast
                clientPackageManager npm
                databaseType sql
                devDatabaseType h2Disk
                dtoSuffix DTO
                enableHibernateCache true
                enableSwaggerCodegen false
                enableTranslation false
                jhiPrefix jhi
                jhipsterVersion "6.0.1"
                jwtSecretKey "HIDDEN"
                messageBroker no
                nativeLanguage en
                packageName com.mycompany.app1
                prodDatabaseType mysql
                searchEngine no
                serverPort 8081
                serviceDiscoveryType eureka
                skipClient true
                skipUserManagement true
                testFrameworks []
                websocket no
              }

              entities Region
            }
            application {
              config {
                applicationType microservice
                authenticationType jwt
                baseName app2
                buildTool maven
                cacheProvider hazelcast
                clientPackageManager npm
                databaseType sql
                devDatabaseType h2Disk
                dtoSuffix DTO
                enableHibernateCache true
                enableSwaggerCodegen false
                enableTranslation false
                jhiPrefix jhi
                jhipsterVersion "6.0.1"
                jwtSecretKey "HIDDEN"
                messageBroker no
                nativeLanguage en
                packageName com.mycompany.app2
                prodDatabaseType mysql
                searchEngine no
                serverPort 8081
                serviceDiscoveryType eureka
                skipClient true
                skipUserManagement true
                testFrameworks []
                websocket no
              }

              entities Country, Location
            }
            application {
              config {
                applicationType microservice
                authenticationType jwt
                baseName app3
                buildTool maven
                cacheProvider hazelcast
                clientPackageManager npm
                databaseType sql
                devDatabaseType h2Disk
                dtoSuffix DTO
                enableHibernateCache true
                enableSwaggerCodegen false
                enableTranslation false
                jhiPrefix jhi
                jhipsterVersion "6.0.1"
                jwtSecretKey "HIDDEN"
                messageBroker no
                nativeLanguage en
                packageName com.mycompany.app3
                prodDatabaseType mysql
                searchEngine no
                serverPort 8081
                serviceDiscoveryType eureka
                skipClient true
                skipUserManagement true
                testFrameworks []
                websocket no
              }
            }

            entity Region {
              regionName String
            }
            entity Country {
              countryName String
            }
            entity Location {
              streetAddress String
              postalCode String
              city String
              stateProvince String
            }
            relationship OneToOne {
              Location{country required} to Country
            }

            noFluentMethod Region, Country, Location
            "
          `);
        });
      });
    });
    context('when passing an output file', () => {
      let dir;
      let output;

      beforeEach(() => {
        dir = path.join(__dirname, '..', '__test-files__', 'json_to_jdl_converter', 'only_app');
        output = path.resolve('exported.jdl');
        convertToJDL(dir, output);
      });

      it('should output it to the output file', () => {
        expect(fs.readFileSync(output, 'utf-8')).not.to.be.null;
      });
    });
  });
  describe('convertSingleContentToJDL', () => {
    context('with microservices attribute', () => {
      let jdl;
      beforeEach(() => {
        jdl = convertSingleContentToJDL({
          'generator-jhipster': {
            microfrontends: [
              {
                baseName: 'foo',
              },
              {
                baseName: 'bar',
              },
            ],
          },
        });
      });

      it('should write a JDL file with the application', () => {
        jestExpect(jdl).toMatch(/microfrontends \[foo, bar\]/);
      });
    });
  });
});
