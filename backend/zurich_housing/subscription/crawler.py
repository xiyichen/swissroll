import requests
from bs4 import BeautifulSoup
from .utils import get_requests_headers, get_woko_type, get_selenium_headers

def check_woko(get_contact_info):
    r = requests.get('http://www.woko.ch/en/nachmieter-gesucht', headers=get_requests_headers())
    soup = BeautifulSoup(r.text, 'lxml')
    items = soup.find("div", {"id": "GruppeID_98"}).find_all("div", {"class": "inserat"})
    items_content_list = []
    items_title_list = []
    for item in items:
        link = 'http://www.woko.ch' + item.find('a', href=True)['href']
        listing_id = link.split('/')[-1]
        title = item.find('h3').text
        rent = int(item.find("div", {"class": 'miete'}).find("div", {"class": "preis"}).text.split('.--')[0])
        start_date = item.find('table').find_all('tr')[0].find_all('td')[-1].text.strip().split(' from ')[-1]
        address = item.find('table').find_all('tr')[1].find_all('td')[-1].text
        listing_type = get_woko_type(address, rent, title.lower())
        title_dict = {'Website': 'WOKO', 'Type': listing_type, 'Link': link, 'Rooms': 1, 'listing_id': listing_id, 'title': title}
        content_dict = {'Monthly Rent': rent, 'Start Date': start_date, 'Address': address}
        if get_contact_info:
            r_d = requests.get(link, headers=get_requests_headers())
            s_d = BeautifulSoup(r_d.text, 'lxml')
            contact_person = s_d.find_all('table')[1].find_all('td')[1].text
            contact_email = s_d.find_all('table')[1].find_all('td')[5].text
            content_dict['Contact Person'] = contact_person
            content_dict['Contact Email'] = contact_email
        items_title_list.append(title_dict)
        items_content_list.append(content_dict)
    return items_title_list, items_content_list

def check_living_science():
    r = requests.get('http://reservation.livingscience.ch/en/living', headers=get_requests_headers())
    soup = BeautifulSoup(r.text, 'lxml')
    items = soup.find("div", {"class": "list scroll"}).find_all("div", {"class": "row status1"})
    items_content_list = []
    items_title_list = []
    for item in items:
        link = "http://reservation.livingscience.ch/en/living"
        # floor = item.find("span", {"class": "spalte1"}).text.split(':')[-1]
        rooms = item.find("span", {"class": "spalte4"}).text.split(':')[-1]
        rooms = float(rooms) if '.' in rooms else int(rooms)
        gross_rent = float(item.find("span", {"class": "spalte5"}).text.split(':')[-1].split(' ')[-1])
        start_date = item.find("span", {"class": "spalte6"}).text.split(':')[-1]
        apprnr = item.find("span", {"class": "spalte7"}).text.split(':')[-1]
        size = item.find("span", {"class": "spalte8"}).text.split(':')[-1].split(' ')[1]
        # housenr = item.find("span", {"class": "spalte10"}).text.split(':')[-1]
        charges = float(item.find("span", {"class": "spalte11"}).text.split(':')[-1].split(' ')[-1])
        title_dict = {'Website': 'Living Science', 'Type': 'studio', 'Link': link, 'Rooms': rooms, 'listing_id': apprnr}
        content_dict = {'Size (square meters)': size, 'Monthly Rent': gross_rent, 'Charges': charges, 'Start Date': start_date}
        items_title_list.append(title_dict)
        items_content_list.append(content_dict)
    return items_title_list, items_content_list

def check_wohnenuzhethz():
    driver = get_selenium_headers()
    driver.get("https://wohnen.ethz.ch/index.php?act=searchoffer")
    language_button = driver.find_element_by_xpath('.//a[@class="language"]')
    language_button.click()
    not_furnished_checkbox = driver.find_element_by_xpath('.//input[@name="MoebilCheckbox_1"]')
    if not_furnished_checkbox.is_selected():
        not_furnished_checkbox.click()
    city_inputbox = driver.find_element_by_xpath('.//input[@name="Ort"]')
    city_inputbox.send_keys("Zürich")
    search_button = driver.find_element_by_xpath('.//input[@value="Search"]')
    search_button.click()
    driver.find_element_by_xpath(".//select[@name='sortHow']/option[text()='Descending']").click()
    driver.find_element_by_xpath(".//select[@name='MultiSortField1']/option[text()='No']").click()
    unfiltered_items = driver.find_elements_by_xpath(".//table[@class='listing']/tbody/tr")
    items_content_list = []
    items_title_list = []
    for unfiltered_item in unfiltered_items:
        tds = unfiltered_item.find_elements_by_xpath(".//td")
        if len(tds) < 12:
            continue
        apprnr = tds[1].find_element_by_xpath(".//a").text
        district = tds[4].text
        rent = "".join(tds[5].text.split("'"))
        listing_type = tds[6].text.lower()
        rooms = tds[7].text
        rooms = float(rooms) if '.' in rooms else int(rooms)
        size = tds[8].text
        start_date = tds[9].text
        end_date = tds[10].text
        furnished = tds[11].text
        link = 'https://wohnen.ethz.ch/index.php?act=detoffer&pid=' + apprnr
        title_dict = {'Website': 'Housing Office of University / ETH Zurich', 'Type': listing_type, 'Link': link,
                      'Rooms': rooms, 'listing_id': apprnr}
        content_dict = {'Furnished': furnished, 'Size (square meters)': size, 'District': district, 'Monthly Rent': rent, 'Start Date': start_date}
        if end_date:
            content_dict['End Date'] = end_date
        items_title_list.append(title_dict)
        items_content_list.append(content_dict)
    return items_title_list, items_content_list