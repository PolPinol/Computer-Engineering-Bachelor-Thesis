import uuid
import time
import datetime
import random
from locust import HttpUser, task, between, tag


class IntegrityTest(HttpUser):
    host = "http://localhost:3000/api"

    wait_time = between(1, 5)

    # TESTING SIGN UP
    # Testing to check a correct sign up
    @tag('test_signup')
    @task
    def task1(self):
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["message"] == "Sign up correctly.":
                        resp.success()
                    else:
                        resp.failure("T_SU_1: Response body error")
                else:
                    resp.failure("T_SU_1: Status code error")
            except Exception as e:
                resp.failure("T_SU_1: JSON parse error" + str(e))

    # Testing to check error at missing username
    @tag('test_signup')
    @task
    def task2(self):
        with self.client.post("/players", json={"password": "a12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' is missing.":
                        resp.success()
                    else:
                        resp.failure("T_SU_2: Response body error")
                else:
                    resp.failure("T_SU_2: Status code error")
            except:
                resp.failure("T_SU_2: JSON parse error")

    # Testing to check error at missing password
    @tag('test_signup')
    @task
    def task3(self):
        with self.client.post("/players", json={"username": "a12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' is missing.":
                        resp.success()
                    else:
                        resp.failure("T_SU_3: Response body error")
                else:
                    resp.failure("T_SU_3: Status code error")
            except:
                resp.failure("T_SU_3: JSON parse error")

    # Testing to check error at existing username
    @tag('test_signup')
    @task
    def task4(self):
        with self.client.post("/players", json={"username": "12345678", "password": "12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "A player with this username already exists.":
                        resp.success()
                    else:
                        resp.failure("T_SU_4: Response body error")
                else:
                    resp.failure("T_SU_4: Status code error")
            except:
                resp.failure("T_SU_4: JSON parse error")

    # Testing to check username with less than 8 digits
    @tag('test_signup')
    @task
    def task5(self):
        with self.client.post("/players", json={"username": "1", "password": "12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' are less than 8 characters / " \
                                               "digits.":
                        resp.success()
                    else:
                        resp.failure("T_SU_5: Response body error")
                else:
                    resp.failure("T_SU_5: Status code error")
            except:
                resp.failure("T_SU_5: JSON parse error")

    # Testing to check password with less than 8 digits
    @tag('test_signup')
    @task
    def task6(self):
        with self.client.post("/players", json={"username": "b12345678", "password": "1"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' are less than 8 characters / " \
                                               "digits.":
                        resp.success()
                    else:
                        resp.failure("T_SU_6: Response body error")
                else:
                    resp.failure("T_SU_6: Status code error")
            except:
                resp.failure("T_SU_6: JSON parse error")

    # TESTING LOG IN
    # Testing to check a correct login
    @tag('test_login')
    @task
    def task7(self):
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        if resp2.status_code == 200:
                            if resp2.json()["auth_key"] != "":
                                resp2.success()
                            else:
                                resp2.failure("T_LI_1: Response body error")
                        else:
                            resp2.failure("T_LI_1: Status code error")
                    except:
                        resp2.failure("T_LI_1: JSON parse error")
            else:
                resp.failure("T_LI_1: Status code error")

    # Testing to check the login error if the username is missing
    @tag('test_login')
    @task
    def task8(self):
        with self.client.post("/players/login", json={"password": "a12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' is missing.":
                        resp.success()
                    else:
                        resp.failure("T_LI_2: Response body error")
                else:
                    resp.failure("T_LI_2: Status code error")
            except:
                resp.failure("T_LI_2: JSON parse error")

    # Testing to check the login error if the password is missing
    @tag('test_login')
    @task
    def task9(self):
        with self.client.post("/players/login", json={"username": "a12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' is missing.":
                        resp.success()
                    else:
                        resp.failure("T_LI_3: Response body error")
                else:
                    resp.failure("T_LI_3: Status code error")
            except:
                resp.failure("T_LI_3: JSON parse error")

    # Testing to check the login error if the username is less than 8 characters
    @tag('test_login')
    @task
    def task10(self):
        with self.client.post("/players/login", json={"username": "1", "password": "12345678"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' are less than 8 characters / " \
                                               "digits.":
                        resp.success()
                    else:
                        resp.failure("T_LI_4: Response body error")
                else:
                    resp.failure("T_LI_4: Status code error")
            except:
                resp.failure("T_LI_4: JSON parse error")

    # Testing to check the login error if the password is less than 8 characters
    @tag('test_login')
    @task
    def task11(self):
        with self.client.post("/players/login", json={"username": "b12345678", "password": "1"},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields 'username' and/or 'password' are less than 8 characters / " \
                                               "digits.":
                        resp.success()
                    else:
                        resp.failure("T_LI_5: Response body error")
                else:
                    resp.failure("T_LI_5: Status code error")
            except:
                resp.failure("T_LI_5: JSON parse error")

    # TESTING LANDS
    # Testing the creation of a land and get the land info
    @tag('test_lands')
    @task
    def task12(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_LAND_1: Log in correctly: JSON parse error")
            else:
                resp.failure("T_LAND_1: Sign up correctly: Status code error")

        # Save time at land creation
        time_created = datetime.datetime.now()

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_LAND_1: Create Land: JSON parse error")
            else:
                resp.failure("T_LAND_1: Create Land: Status code error")

        time.sleep(random.randint(3, 9))

        # Validate get info from land
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    if (resp.json()['_id'] != land_id):
                        resp.failure("Get info from Land: " + "Not same land")

                    check = resp.json()['name']
                    resources = resp.json()['resources']
                    check = resp.json()['pyramidLevel']
                    check = resp.json()['troops']
                    check = resp.json()['resourcesFields']
                    check = resp.json()['buildingsFields']
                    check = resp.json()['eventsTime']
                    production = resp.json()['productions']

                    time_get_info = datetime.datetime.now()

                    print(resources)
                    print(production)

                    expected_resources = len(resources)
                    total_resources = 0

                    for i in range(len(production)):
                        prod = production[i]
                        for j in range(len(resources)):
                            resource = resources[j]
                            if prod['type'] == resource['type']:
                                seconds = round((time_get_info.timestamp() - time_created.timestamp()))
                                if abs(seconds * prod['production'] - resource['quantity']) <= 1:  # error
                                    total_resources += 1
                                    break
                                else:
                                    resp.failure("T_LAND_1: Get info from Land: Resources not upgraded")

                    if total_resources == expected_resources:
                        resp.success()
                    else:
                        resp.failure("T_LAND_1: Get info from Land == Resources not upgraded " + str(total_resources) + ' ' + str(expected_resources))

                except Exception as e:
                    resp.failure("T_LAND_1: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_LAND_1: Get info from Land: Status code error")

    # Testing the error with an incorrect land id, not owned by the player logged in
    @tag('test_lands')
    @task
    def task13(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except Exception as e:
                        resp2.failure("T_LAND_2: Log in correctly: JSON parse error " + str(e))
            else:
                resp.failure("T_LAND_2: Sign up correctly: Status code error")

        # Validate error at get info from land
        with self.client.get("/lands/" + uuid.uuid4().hex, headers={'Authorization': auth},
                             catch_response=True) as resp:
            try:
                if resp.status_code == 404:
                    if resp.json()["error"] == "T_LAND_2: This land is not owned by the player.":
                        resp.success()
                    else:
                        resp.failure("T_LAND_2: Error land request: Response body error")
                else:
                    resp.failure("T_LAND_2: Error land request: Status code error")
            except Exception as e:
                resp.failure("T_LAND_2: Error land request: JSON parse error" + str(e))

    # Testing all methodology about building
    @tag('test_lands')
    @task
    def task14(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_LAND_3: Log in correctly: JSON parse error")
            else:
                resp.failure("T_LAND_3: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_LAND_3: Create Land: JSON parse error")
            else:
                resp.failure("T_LAND_3: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(30)

        # Error without body
        with self.client.post("/lands/building", headers={'Authorization': auth}, catch_response=True) as resp:
            try:
                if resp.status_code == 400:
                    if resp.json()["error"] == "Fields on body request are not correct / missing.":
                        resp.success()
                    else:
                        resp.failure("T_LAND_3: Error build request: (no body) Response body error")
                else:
                    resp.failure("T_LAND_3: Error build request: (no body) Status code error")
            except Exception as e:
                resp.failure("T_LAND_3: Error build request: JSON parse error" + str(e))

        obj = {'landId': land_id, 'buildingId': 'ERROR', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 404:
                    if resp.json()["error"] == "The building id is incorrect.":
                        resp.success()
                    else:
                        resp.failure("T_LAND_3: Error build request: (buildid error) Response body error")
                else:
                    resp.failure("T_LAND_3: Error build request: (buildid error) Status code error")
            except Exception as e:
                resp.failure("T_LAND_3: Error build request: JSON parse error" + str(e))

        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 0}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 404:
                    if resp.json()["error"] == "The nField is incorrect.":
                        resp.success()
                    else:
                        resp.failure("T_LAND_3: Error build request: (nField error) Response body error")
                else:
                    resp.failure("T_LAND_3: Error build request: (nField error) Status code error")
            except Exception as e:
                resp.failure("T_LAND_3: Error build request: JSON parse error" + str(e))

        # Get resources before built
        preResources = {}
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    preResources = resp.json()['resources']
                    resp.success()
                except Exception as e:
                    resp.failure("T_LAND_3: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_LAND_3: Get info from Land: Status code error")

        # Built correctly
        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_LAND_3: Error build request: (build correct) Response body error")
                else:
                    resp.failure("T_LAND_3: Error build request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_LAND_3: Error build request: JSON parse error" + str(e))

        # Check that building is in queue and you have less resources
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    resources = resp.json()['resources']
                    eventsTime = resp.json()['eventsTime']

                    if resources[0]['quantity'] >= preResources[0]['quantity']:
                        resp.failure("Removing resources built")
                    else:
                        if eventsTime[1]['type'] == 'build':
                            resp.success()
                        else:
                            resp.failure("T_LAND_3: Not in queue building")
                except Exception as e:
                    resp.failure("T_LAND_3: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_LAND_3: Get info from Land: Status code error")

        # Wait until is built (can change over the future the time)
        time.sleep(35)

        # Check if building is built
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    buildingsFields = resp.json()['buildingsFields']
                    eventsTime = resp.json()['eventsTime']

                    if buildingsFields[0]['type'] == 'BUILDING_HIDING_PLACE':
                        if len(eventsTime) == 1:
                            resp.success()
                        else:
                            resp.failure("T_LAND_3: Still in queue")
                    else:
                        resp.failure("T_LAND_3: Not the correct building built")
                except Exception as e:
                    resp.failure("T_LAND_3: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_LAND_3: Get info from Land: Status code error")

    # Testing all methodology about upgrading buildings
    @tag('test_upgrades')
    @task
    def task15(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_UPG_1: Log in correctly: JSON parse error")
            else:
                resp.failure("T_UPG_1: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_UPG_1: Create Land: JSON parse error")
            else:
                resp.failure("T_UPG_1: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(30)

        # Built correctly
        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_1: Error build request: (build correct) Response body error")
                else:
                    resp.failure("T_UPG_1: Error build request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_UPG_1: Error build request: JSON parse error" + str(e))

        # Wait until is built (can change over the future the time)
        time.sleep(40)

        # Check if building is built
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    buildingsFields = resp.json()['buildingsFields']
                    eventsTime = resp.json()['eventsTime']

                    if buildingsFields[0]['type'] == 'BUILDING_HIDING_PLACE':
                        if len(eventsTime) == 1:
                            resp.success()
                        else:
                            resp.failure("T_UPG_1: Still in queue")
                    else:
                        resp.failure("T_UPG_1: Not the correct building built")
                except Exception as e:
                    resp.failure("T_UPG_1: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_1: Get info from Land: Status code error")

        # upgrade ok
        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_1: Error upgrade request: (build correct) Response body error")
                else:
                    resp.failure("T_UPG_1: Error upgrade request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_UPG_1: Error upgrade request: JSON parse error" + str(e))

        # Wait until is upgraded (can change over the future the time)
        time.sleep(40)

        # Check if building is upgraded
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    buildingsFields = resp.json()['buildingsFields']
                    eventsTime = resp.json()['eventsTime']

                    if buildingsFields[0]['type'] == 'BUILDING_HIDING_PLACE' and buildingsFields[0]['level'] == 2:
                        if len(eventsTime) == 1:
                            resp.success()
                        else:
                            resp.failure("T_UPG_1: Still in queue")
                    else:
                        resp.failure("T_UPG_1: Not the correct upgrade")
                except Exception as e:
                    resp.failure("T_UPG_1: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_1: Get info from Land: Status code error")

    # TEST BUILD AND THEN UPGRADE IN QUEUE
    @tag('test_upgrades')
    @task
    def task16(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_UPG_2: Log in correctly: JSON parse error")
            else:
                resp.failure("T_UPG_2: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_UPG_2: Create Land: JSON parse error")
            else:
                resp.failure("T_UPG_2: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(100)

        # Built correctly
        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_2: Error build request: (build correct) Response body error")
                else:
                    resp.failure("T_UPG_2: Error build request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_UPG_2: Error build request: JSON parse error" + str(e))

        # upgrade ok
        obj = {'landId': land_id, 'buildingId': 'BUILDING_HIDING_PLACE', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_2: Error upgrade request: (build correct) Response body error")
                else:
                    resp.failure("T_UPG_2: Error upgrade request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_UPG_2: Error upgrade request: JSON parse error" + str(e))

        # Wait until is upgraded (can change over the future the time)
        time.sleep(50)

        # Check is still not upgraded (queue model -> upgrade advance time after is built)
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    buildingsFields = resp.json()['buildingsFields']
                    eventsTime = resp.json()['eventsTime']

                    if buildingsFields[0]['type'] == 'BUILDING_HIDING_PLACE' and buildingsFields[0]['level'] == 1:
                        if len(eventsTime) == 2:
                            resp.success()
                        else:
                            resp.failure("T_UPG_2: Not in queue. Upgrade done.")
                    else:
                        resp.failure("T_UPG_2: Not the correct upgrade 2")
                except Exception as e:
                    resp.failure("T_UPG_2: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_2: Get info from Land: Status code error")

        # Wait until is upgraded for real
        time.sleep(50)

        # Check if building is upgraded
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    buildingsFields = resp.json()['buildingsFields']
                    eventsTime = resp.json()['eventsTime']

                    if buildingsFields[0]['type'] == 'BUILDING_HIDING_PLACE' and buildingsFields[0]['level'] == 2:
                        if len(eventsTime) == 1:
                            resp.success()
                        else:
                            resp.failure("T_UPG_2: Still in queue")
                    else:
                        resp.failure("T_UPG_2: Not the correct upgrade 3")
                except Exception as e:
                    resp.failure("T_UPG_2: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_2: Get info from Land: Status code error")

    # TEST UPGRADE PYRAMID
    @tag('test_upgrades')
    @task
    def task17(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_UPG_3: Log in correctly: JSON parse error")
            else:
                resp.failure("T_UPG_3: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_UPG_3: Create Land: JSON parse error")
            else:
                resp.failure("T_UPG_3: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(100)

        # upgrade ok
        obj = {'landId': land_id}
        with self.client.post("/lands/pyramid", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_3: Error pyramid request: Response body error")
                else:
                    resp.failure("T_UPG_3: Error pyramid request: Status code error")
            except Exception as e:
                resp.failure("T_UPG_3: Error pyramid request: JSON parse error" + str(e))

        # Wait until is upgraded (can change over the future the time)
        time.sleep(100)

        # Check if upgraded
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    eventsTime = resp.json()['eventsTime']
                    if resp.json()['pyramidLevel'] == 2:
                        if len(eventsTime) == 1:
                            resp.success()
                        else:
                            resp.failure("T_UPG_3: Still in queue")
                    else:
                        resp.failure("T_UPG_3: Not the correct upgrade")
                except Exception as e:
                    resp.failure("T_UPG_3: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_3: Get info from Land: Status code error")


    # TEST UPGRADE RESOURCE
    @tag('test_upgrades')
    @task
    def task18(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_UPG_4: Log in correctly: JSON parse error")
            else:
                resp.failure("T_UPG_4: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_UPG_4: Create Land: JSON parse error")
            else:
                resp.failure("T_UPG_4: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(50)

        # upgrade to lvl 2
        obj = {'landId': land_id, "nField": 1}
        with self.client.post("/lands/resource", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_4: Error resource request: Response body error")
                else:
                    resp.failure("T_UPG_4: Error resource request: Status code error")
            except Exception as e:
                resp.failure("T_UPG_4: Error resource request: JSON parse error" + str(e))

        # upgrade to lvl 3
        obj = {'landId': land_id, "nField": 1}
        with self.client.post("/lands/resource", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_UPG_4: Error resource request: Response body error")
                else:
                    resp.failure("T_UPG_4: Error resource request: Status code error")
            except Exception as e:
                resp.failure("T_UPG_4: Error resource request: JSON parse error" + str(e))

        # Get resources to check at the end
        preLand = {}
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    preLand = resp.json()
                    resp.success()
                except Exception as e:
                    resp.failure("T_UPG_4: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_4: Get info from Land: Status code error")

        # Wait until is upgraded resource to level 3
        time.sleep(100)

        # TIMELINE
        # 0s             40s                 90s         100s
        # |---------------|--------------------|----------|
        #       LVL 1            LVL 2              LVL 3
        # production
        # 40s a LVL1
        # 50s a LVL2
        # 10s a LVL3
        # We will check: quantityLvL1 * 100s < outputQuantity < quantityLvl3 * 100s
        # We assume that nField1 is always RESOURCE_WOOD -> resources[0]

        # Check if upgraded to level 3 first
        with self.client.get("/lands/" + land_id, headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land = resp.json()
                    eventsTime = land['eventsTime']
                    if land['resourcesFields'][0]['level'] == 3:
                        if len(eventsTime) == 1:
                            minExp = preLand['resources'][0]['quantity'] + preLand['productions'][0]['production'] * 100
                            output = land['resources'][0]['quantity']
                            maxExp = preLand['resources'][0]['quantity'] + land['productions'][0]['production'] * 100
                            if minExp < output and output < maxExp:
                                resp.success()
                            else:
                                resp.failure("T_UPG_4: Error at productions upgraded")
                        else:
                            resp.failure("T_UPG_4: Still in queue")
                    else:
                        resp.failure("T_UPG_4: Not the correct upgrade 3")
                except Exception as e:
                    resp.failure("T_UPG_4: Get info from Land: JSON parse error " + str(e))
            else:
                resp.failure("T_UPG_4: Get info from Land: Status code error")

    # TESTING RECRUITING TROOPS AND ADVENTURES
    @tag('test_troops')
    @task
    def task19(self):
        # CREATE PLAYER AND LOG IN
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex
        auth = 'Bearer '
        with self.client.post("/players", json={"username": username, "password": password},
                              catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
                with self.client.post("/players/login", json={"username": username, "password": password},
                                      catch_response=True) as resp2:
                    try:
                        auth = auth + resp2.json()["auth_key"]
                        resp2.success()
                    except:
                        resp2.failure("T_TROOP_1: Log in correctly: JSON parse error")
            else:
                resp.failure("T_TROOP_1: Sign up correctly: Status code error")

        # Validate creation of the land
        land_id = ''
        with self.client.get("/lands", headers={'Authorization': auth}, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    land_id = resp.json()['lands'][0]
                    resp.success()
                except:
                    resp2.failure("T_TROOP_1: Create Land: JSON parse error")
            else:
                resp.failure("T_TROOP_1: Create Land: Status code error")

        # Wait until you have the resources (min 300 approx)
        time.sleep(30)

        # Built correctly
        obj = {'landId': land_id, 'buildingId': 'BUILDING_SLAVE_DORMITORIES', 'nField': 1}
        with self.client.post("/lands/building", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_TROOP_1: Error build request: (build correct) Response body error")
                else:
                    resp.failure("T_TROOP_1: Error build request: (build correct) Status code error")
            except Exception as e:
                resp.failure("T_TROOP_1: Error build request: JSON parse error" + str(e))

        # Wait until is built (can change over the future the time)
        time.sleep(40)

        # Troops recruited correctly
        obj = {'landId': land_id, 'troopId': 'TROOP_SLAVE', 'quantity': 10}
        with self.client.post("/lands/troops", json=obj, headers={'Authorization': auth},
                              catch_response=True) as resp:
            try:
                if resp.status_code == 200:
                    if resp.json()["ok"] == 1:
                        resp.success()
                    else:
                        resp.failure("T_TROOP_1: Error troop request: (troop correct) Response body error")
                else:
                    resp.failure("T_TROOP_1: Error troop request: (troop correct) Status code error")
            except Exception as e:
                resp.failure("T_TROOP_1: Error troop request: JSON parse error" + str(e))


    # TESTING DE PERFORMANCE
    @tag('test_performance')
    @task
    def task99(self):
        username = uuid.uuid4().hex
        password = uuid.uuid4().hex

        self.client.post("/players", json={"username": username, "password": password})

        with self.client.post("/players/login", json={"username": username, "password": password},
                              catch_response=True) as resp:
            auth = resp.json()["auth_key"]

        auth_key = 'Bearer ' + auth

        with self.client.get("/lands", headers={'Authorization': auth_key}, catch_response=True) as resp:
            land_id = resp.json()['lands'][0]

        while True:
            with self.client.get("/lands/" + land_id, headers={'Authorization': auth_key}, catch_response=True) as resp:
                if resp.status_code == 200:
                    resp.success()
                else:
                    resp.failure()
            time.sleep(1)

