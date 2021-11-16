from .emailbot import EmailBot
from .crawler import check_woko, check_living_science, check_wohnenuzhethz
from .cronservices import WOKORecordService, LivingScienceRecordService, WohnenUZHETHZRecordService
from datetime import datetime

def check_woko_scheduler():
    wokoRecordService = WOKORecordService()
    previous_records = wokoRecordService.get_all_records()
    items_title_list, items_content_list = check_woko(False)
    new_items_title_list = []
    new_items_content_list = []
    for item_title, item_content in zip(items_title_list, items_content_list):
        if item_title['listing_id'] not in previous_records:
            new_items_title_list.append(item_title)
            new_items_content_list.append(item_content)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('WOKO', new_items_title_list, new_items_content_list)
    wokoRecordService.update_records(items_title_list)

def check_living_science_scheduler():
    livingScienceRecord = LivingScienceRecordService()
    previous_records = livingScienceRecord.get_all_records()
    items_title_list, items_content_list = check_living_science()
    new_items_title_list = []
    new_items_content_list = []
    for item_title, item_content in zip(items_title_list, items_content_list):
        if item_title['listing_id'] not in previous_records:
            new_items_title_list.append(item_title)
            new_items_content_list.append(item_content)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('Living Science', new_items_title_list, new_items_content_list)
    livingScienceRecord.update_records(items_title_list)

def check_wohnenuzhethz_scheduler():
    wohnenUZHETHZRecord = WohnenUZHETHZRecordService()
    previous_records = wohnenUZHETHZRecord.get_all_records()
    items_title_list, items_content_list = check_wohnenuzhethz()
    new_items_title_list = []
    new_items_content_list = []
    for item_title, item_content in zip(items_title_list, items_content_list):
        if item_title['listing_id'] not in previous_records:
            new_items_title_list.append(item_title)
            new_items_content_list.append(item_content)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('Housing Office of University / ETH Zurich', new_items_title_list, new_items_content_list)
    wohnenUZHETHZRecord.update_records(items_title_list)