# Generated by Django 3.0.1 on 2020-01-03 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0005_scheduleddish_max_orders'),
    ]

    operations = [
        migrations.AddField(
            model_name='dish',
            name='dish_type',
            field=models.CharField(choices=[('MAIN', 'Main'), ('SALAD', 'Salad')], default='MAIN', max_length=5),
        ),
    ]
