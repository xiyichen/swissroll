from .models import WOKO, LivingScience, WohnenUZHETHZ

class WOKORecordService:
    def update_records(self, previous_records_to_remove, new_items_title_list):
        for id in previous_records_to_remove:
            WOKO.objects.filter(link_id=id).delete()
        # WOKO.objects.all().delete()
        for item_title in new_items_title_list:
            woko_record = WOKO.objects.create(link_id=item_title['listing_id'])
            woko_record.save()

    def get_all_records(self):
        link_id_list = []
        queries = WOKO.objects.all()
        for query in queries:
            link_id_list.append(query.link_id)
        return link_id_list

class LivingScienceRecordService:
    def update_records(self, previous_records_to_remove, new_items_title_list):
        for id in previous_records_to_remove:
            LivingScience.objects.filter(apartment_nr=id).delete()
        # LivingScience.objects.all().delete()
        for item_title in new_items_title_list:
            ls_record = LivingScience.objects.create(apartment_nr=item_title['listing_id'])
            ls_record.save()

    def get_all_records(self):
        apartment_nr_list = []
        queries = LivingScience.objects.all()
        for query in queries:
            apartment_nr_list.append(query.apartment_nr)
        return apartment_nr_list

class WohnenUZHETHZRecordService:
    def update_records(self, previous_records_to_remove, new_items_title_list):
        for id in previous_records_to_remove:
            WohnenUZHETHZ.objects.filter(apartment_nr=id).delete()
        WohnenUZHETHZ.objects.all().delete()
        for item_title in new_items_title_list:
            wohnenuzhethz_record = WohnenUZHETHZ.objects.create(apartment_nr=item_title['listing_id'])
            wohnenuzhethz_record.save()

    def get_all_records(self):
        apartment_nr_list = []
        queries = WohnenUZHETHZ.objects.all()
        for query in queries:
            apartment_nr_list.append(query.apartment_nr)
        return apartment_nr_list