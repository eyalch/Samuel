# Generated by Django 3.0.1 on 2020-01-06 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0006_dish_dish_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='scheduleddish',
            old_name='max_orders',
            new_name='orders_left',
        ),
        migrations.AlterField(
            model_name='dish',
            name='description',
            field=models.TextField(),
        ),
    ]