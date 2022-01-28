from .emailbot import EmailBot
from .crawler import check_woko, check_living_science, check_wohnenuzhethz
from .cronservices import WOKORecordService, LivingScienceRecordService, WohnenUZHETHZRecordService
from datetime import datetime

def sort_by_listing_id(items_title_list, items_content_list):
    pairs = list(zip(items_title_list, items_content_list))
    pairs.sort(key=lambda p: (p[0]['listing_id'], p[1]))
    items_title_list[:], items_content_list[:] = zip(*pairs)
    return items_title_list, items_content_list

def find_new_items(previous_records, items_title_list, items_content_list):
    new_items_title_list = []
    new_items_content_list = []
    previous_records_to_remove = []
    i, j = 0, 0
    while j < len(items_title_list):
        if i == len(previous_records):
            new_items_title_list += items_title_list[j:]
            new_items_content_list += items_content_list[j:]
            break
        if previous_records[i] == items_title_list[j]['listing_id']:
            i += 1
            j += 1
        elif previous_records[i] < items_title_list[j]['listing_id']:
            previous_records_to_remove.append(previous_records[i])
            i += 1
        else:
            new_items_title_list.append(items_title_list[j])
            new_items_content_list.append(items_content_list[j])
            j += 1
    return previous_records_to_remove, new_items_title_list, new_items_content_list

def check_woko_scheduler():
    wokoRecordService = WOKORecordService()
    previous_records = wokoRecordService.get_all_records()
    previous_records.sort()
    items_title_list, items_content_list = check_woko()
    items_title_list, items_content_list = sort_by_listing_id(items_title_list, items_content_list)
    previous_records_to_remove, new_items_title_list, new_items_content_list = find_new_items(previous_records, items_title_list, items_content_list)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('WOKO', new_items_title_list, new_items_content_list)
    wokoRecordService.update_records(previous_records_to_remove, new_items_title_list)

def check_living_science_scheduler():
    livingScienceRecord = LivingScienceRecordService()
    previous_records = livingScienceRecord.get_all_records()
    previous_records.sort()
    items_title_list, items_content_list = check_living_science()
    items_title_list, items_content_list = sort_by_listing_id(items_title_list, items_content_list)
    previous_records_to_remove, new_items_title_list, new_items_content_list = find_new_items(previous_records, items_title_list, items_content_list)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('Living Science', new_items_title_list, new_items_content_list)
    livingScienceRecord.update_records(previous_records_to_remove, new_items_title_list)

def check_wohnenuzhethz_scheduler():
    wohnenUZHETHZRecord = WohnenUZHETHZRecordService()
    previous_records = wohnenUZHETHZRecord.get_all_records()
    previous_records.sort()
    items_title_list, items_content_list = check_wohnenuzhethz()
    items_title_list, items_content_list = sort_by_listing_id(items_title_list, items_content_list)
    previous_records_to_remove, new_items_title_list, new_items_content_list = find_new_items(previous_records, items_title_list, items_content_list)
    print('Current Time: {}. Found {} new items.'.format(datetime.now(), len(new_items_title_list)))
    if len(new_items_title_list) > 0:
        emailBot = EmailBot()
        emailBot.send_update_emails('Housing Office of University / ETH Zurich', new_items_title_list, new_items_content_list)
    wohnenUZHETHZRecord.update_records(previous_records_to_remove, new_items_title_list)